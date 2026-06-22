"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export async function saveAdresse(formData: FormData) {
  await requireStaff();
  const supabase = createClient();

  const id = (formData.get("id") as string) || "";
  const images = formData
    .getAll("images")
    .map((i) => String(i))
    .filter(Boolean);

  const payload = {
    nom: (formData.get("nom") as string) || "",
    slug: (formData.get("slug") as string) || "",
    description: (formData.get("description") as string) || null,
    categorie_id: (formData.get("categorie_id") as string) || null,
    adresse: (formData.get("adresse") as string) || null,
    ville: (formData.get("ville") as string) || null,
    region: (formData.get("region") as string) || null,
    telephone: (formData.get("telephone") as string) || null,
    site_web: (formData.get("site_web") as string) || null,
    email: (formData.get("email") as string) || null,
    instagram: (formData.get("instagram") as string) || null,
    image: (formData.get("image") as string) || null,
    images: images.length ? images : null,
    horaires: (formData.get("horaires") as string) || null,
    prix_moyen: (formData.get("prix_moyen") as string) || null,
    statut: (formData.get("statut") as string) || "draft",
    featured: formData.get("featured") === "true"
  };

  if (id) {
    await supabase.from("adresses").update(payload).eq("id", id);
  } else {
    await supabase.from("adresses").insert(payload);
  }

  revalidatePath("/admin/adresses");
  revalidatePath("/bonnes-adresses");
  redirect("/admin/adresses");
}

export async function deleteAdresse(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (id) {
    await supabase.from("adresses").delete().eq("id", id);
  }
  revalidatePath("/admin/adresses");
}
