"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTaskStatus } from "@/actions/tasks";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  team_id: string;
  assignee_id: string | null;
};

const columns = [
  { id: "todo" as const, title: "📋 To Do", color: "bg-blue-50" },
  {
    id: "in_progress" as const,
    title: "🚧 In Progress",
    color: "bg-yellow-50",
  },
  { id: "done" as const, title: "✅ Done", color: "bg-green-50" },
];

export default function DashboardPage() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      return data as Task[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
    },
  });

  // Update status mutation with optimistic update
  const updateStatusMutation = useMutation({
    mutationFn: ({
      taskId,
      newStatus,
    }: {
      taskId: string;
      newStatus: "todo" | "in_progress" | "done";
    }) => updateTaskStatus(taskId, newStatus),
    onMutate: async ({ taskId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const formData = new FormData();
    formData.append("title", title);
    await createMutation.mutateAsync(formData);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = (
    e: React.DragEvent,
    newStatus: "todo" | "in_progress" | "done",
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      updateStatusMutation.mutate({ taskId, newStatus });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Group tasks
  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AetherFlow Kanban</h1>
      </div>

      {/* Task Creation */}
      <Card className="max-w-md mb-10">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Build AI suggestion feature"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Kanban Board with Drag & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card
            key={column.id}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
            className={`transition-colors ${column.color}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {column.title} ({groupedTasks[column.id].length})
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[500px] p-4 space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : groupedTasks[column.id].length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Drop tasks here
                </p>
              ) : (
                groupedTasks[column.id].map((task) => (
                  <motion.div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, task)}
                    whileDrag={{
                      scale: 1.05,
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    className="p-4 bg-white border rounded-xl shadow-sm cursor-grab active:cursor-grabbing"
                  >
                    <p className="font-medium leading-tight">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
