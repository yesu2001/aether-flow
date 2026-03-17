"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/actions/tasks";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
};

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
      .channel("tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append("title", title);
    await createMutation.mutateAsync(formData);
  };

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AetherFlow Kanban</h1>
      </div>

      {/* Task Creation Form */}
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
                placeholder="Implement drag and drop"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📋 To Do ({todoTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[500px] p-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : todoTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No tasks in To Do</p>
            ) : (
              todoTasks.map((task) => (
                <div key={task.id} className="p-4 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium">{task.title}</p>
                  {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🚧 In Progress ({inProgressTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[500px] p-4 space-y-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No tasks in progress</p>
            ) : (
              inProgressTasks.map((task) => (
                <div key={task.id} className="p-4 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium">{task.title}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Done */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">✅ Done ({doneTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[500px] p-4 space-y-3">
            {doneTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No completed tasks</p>
            ) : (
              doneTasks.map((task) => (
                <div key={task.id} className="p-4 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium">{task.title}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}