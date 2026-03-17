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

  // For MVP we will create a default team if not exists later. For now, we'll hardcode a placeholder.
  // TODO: Link to real team

  const { error } = await supabase.from("tasks").insert({
    title: title.trim(),
    description,
    status: "todo",
    priority: "medium",
    team_id: "00000000-0000-0000-0000-000000000000", // placeholder for now
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: "Task created!" };
}
