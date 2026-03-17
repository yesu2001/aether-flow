"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/actions/tasks";
import { getCurrentUser } from "@/lib/supabase/auth"; // still server for initial check, but we'll adjust
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [title, setTitle] = useState("");

  const queryClient = useQueryClient();

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

      {/* Kanban Board Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📋 To Do</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            Tasks will appear here
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>🚧 In Progress</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            Tasks will appear here
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>✅ Done</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            Tasks will appear here
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
