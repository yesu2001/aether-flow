import { getCurrentUser } from "@/lib/supabase/auth";

export default async function TestPage() {
  const user = await getCurrentUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
