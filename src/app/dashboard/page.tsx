import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Kanban Board</h1>
        <p className="text-muted-foreground">Welcome, {user.email}</p>
      </div>

      {/* Task Creation Form - will be made interactive in next step */}
      <Card className="max-w-md mb-10">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" placeholder="Implement login UI" />
            </div>
            <Button type="submit" className="w-full">
              Create Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Placeholder for Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle>Kanban Board</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Kanban board coming in next step with drag & drop + realtime
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
