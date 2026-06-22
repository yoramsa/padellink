"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export async function deleteNewsletter(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (id) await supabase.from("newsletters").delete().eq("id", id);
  revalidatePath("/admin/newsletter");
}
