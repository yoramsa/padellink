"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function createCategory(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const nom = ((formData.get("nom") as string) || "").trim();
  if (!nom) return;

  await supabase.from("categories").insert({
    nom,
    slug: slugify(nom),
    type: (formData.get("type") as string) || "news",
    couleur: (formData.get("couleur") as string) || "#4A6FD4",
    icone: (formData.get("icone") as string) || null
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (id) await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}
