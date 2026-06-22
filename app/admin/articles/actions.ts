"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export async function saveArticle(formData: FormData) {
  const profile = await requireStaff();
  const supabase = createClient();

  const id = (formData.get("id") as string) || "";
  const statut = (formData.get("statut") as string) || "draft";

  const payload = {
    titre: (formData.get("titre") as string) || "",
    slug: (formData.get("slug") as string) || "",
    extrait: (formData.get("extrait") as string) || null,
    contenu: (formData.get("contenu") as string) || null,
    image_cover: (formData.get("image_cover") as string) || null,
    categorie_id: (formData.get("categorie_id") as string) || null,
    statut,
    featured: formData.get("featured") === "true"
  };

  const tagIds = formData.getAll("tags").map((t) => String(t));

  let articleId = id;

  if (id) {
    await supabase.from("articles").update(payload).eq("id", id);
    if (statut === "published") {
      const { data } = await supabase
        .from("articles")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();
      if (data && !data.published_at) {
        await supabase
          .from("articles")
          .update({ published_at: new Date().toISOString() })
          .eq("id", id);
      }
    }
  } else {
    const insert = {
      ...payload,
      auteur_id: profile.id,
      published_at: statut === "published" ? new Date().toISOString() : null
    };
    const { data } = await supabase
      .from("articles")
      .insert(insert)
      .select("id")
      .single();
    articleId = data?.id || "";
  }

  if (articleId) {
    await supabase.from("articles_tags").delete().eq("article_id", articleId);
    if (tagIds.length) {
      await supabase
        .from("articles_tags")
        .insert(tagIds.map((tag_id) => ({ article_id: articleId, tag_id })));
    }
  }

  revalidatePath("/admin/articles");
  revalidatePath("/");
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await requireStaff();
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (id) {
    await supabase.from("articles").delete().eq("id", id);
  }
  revalidatePath("/admin/articles");
}
