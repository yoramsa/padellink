import { createClient } from "@/lib/supabase/server";
import type {
  Article,
  Adresse,
  Category,
  Tag,
  Publicite,
  Newsletter,
  Profile
} from "@/lib/types";

export async function adminListArticles(): Promise<Article[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, categorie:categories(*)")
    .order("created_at", { ascending: false });
  return (data as Article[]) || [];
}

export async function adminGetArticle(id: string): Promise<Article | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Article) || null;
}

export async function adminGetArticleTagIds(id: string): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles_tags")
    .select("tag_id")
    .eq("article_id", id);
  return (data || []).map((row: { tag_id: string }) => row.tag_id);
}

export async function adminListAdresses(): Promise<Adresse[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("adresses")
    .select("*, categorie:categories(*)")
    .order("created_at", { ascending: false });
  return (data as Adresse[]) || [];
}

export async function adminGetAdresse(id: string): Promise<Adresse | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("adresses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Adresse) || null;
}

export async function adminListCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("nom");
  return (data as Category[]) || [];
}

export async function adminListTags(): Promise<Tag[]> {
  const supabase = createClient();
  const { data } = await supabase.from("tags").select("*").order("nom");
  return (data as Tag[]) || [];
}

export async function adminListPublicites(): Promise<Publicite[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("publicites")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Publicite[]) || [];
}

export async function adminListNewsletter(): Promise<Newsletter[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("newsletters")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Newsletter[]) || [];
}

export async function adminListProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Profile[]) || [];
}

export async function adminStats() {
  const supabase = createClient();

  const published = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("statut", "published");

  const adresses = await supabase
    .from("adresses")
    .select("id", { count: "exact", head: true });

  const abonnes = await supabase
    .from("newsletters")
    .select("id", { count: "exact", head: true })
    .eq("actif", true);

  const vuesRows = await supabase.from("articles").select("vues");
  const vues = (vuesRows.data || []).reduce(
    (sum: number, row: { vues: number | null }) => sum + (row.vues || 0),
    0
  );

  return {
    articles: published.count || 0,
    adresses: adresses.count || 0,
    abonnes: abonnes.count || 0,
    vues
  };
}
