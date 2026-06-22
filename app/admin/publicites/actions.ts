"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export async function createPublicite(formData: FormData) {
  await requireStaff();
  const supabase = createClient();

  const image = (formData.get("image") as string) || "";
  const lien = (formData.get("lien") as string) || "";
  if (!image || !lien) return;

  await supabase.from("publicites").insert({
    titre: (formData.get("titre") as string) || null,
    image,
    lien,
    emplacement: (formData.get("emplacement") as string) || "home",
    date_debut: (formData.get("date_debut") as string) || null,
    date_fin: (formData.get("date_fin") as string) || null,
    actif: true
  });

  revalidatePath("/admin/publicites");
}

export async function togglePublicite(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const id = formData.get("id") as string;
  const actif = formData.get("actif") === "true";
  if (id) {
    await supabase.from("publicites").update({ actif: !actif }).eq("id", id);
  }
  revalidatePath("/admin/publicites");
}

export async function deletePublicite(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (id) await supabase.from("publicites").delete().eq("id", id);
  revalidatePath("/admin/publicites");
}
