"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function updateRole(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const id = formData.get("id") as string;
  const role = (formData.get("role") as string) || "lecteur";
  if (id) {
    await supabase.from("profiles").update({ role }).eq("id", id);
  }
  revalidatePath("/admin/utilisateurs");
}
