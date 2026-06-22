"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function createTag(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const nom = ((formData.get("nom") as string) || "").trim();
  if (!nom) return;
  await supabase.from("tags").insert({ nom, slug: slugify(nom) });
  revalidatePath("/admin/tags");
}

export async function deleteTag(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (id) await supabase.from("tags").delete().eq("id", id);
  revalidatePath("/admin/tags");
}
