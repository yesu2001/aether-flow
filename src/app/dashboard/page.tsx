import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.email}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No tasks yet. Create your first team or task.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Coming soon: AI task suggestions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
