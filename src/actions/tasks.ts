"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;

  if (!title?.trim()) {
    return { error: "Title is required" };
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check if user has a team, if not create one
  let { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!team) {
    const { data: newTeam, error: teamError } = await supabase
      .from("teams")
      .insert({ name: `${user.email}'s Team`, owner_id: user.id })
      .select()
      .single();

    if (teamError) return { error: teamError.message };
    if (!newTeam) return { error: "Failed to create team" }; // ← add this

    team = newTeam;
  }

  // TypeScript now knows: if we reach this line, team is not null
  const { error } = await supabase.from("tasks").insert({
    title: title.trim(),
    description,
    status: "todo",
    priority: "medium",
    team_id: team.id, // ✅ safe
    assignee_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: "Task created successfully!" };
}
