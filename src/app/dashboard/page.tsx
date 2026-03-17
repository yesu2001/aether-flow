import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AetherFlow Kanban</h1>
        <p className="text-muted-foreground">Logged in as {user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📋 To Do</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[500px] p-4">
            <p className="text-center text-muted-foreground py-12">
              No tasks yet
            </p>
          </CardContent>
        </Card>

        {/* In Progress Column */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚧 In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[500px] p-4">
            <p className="text-center text-muted-foreground py-12">
              No tasks yet
            </p>
          </CardContent>
        </Card>

        {/* Done Column */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">✅ Done</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[500px] p-4">
            <p className="text-center text-muted-foreground py-12">
              No tasks yet
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
