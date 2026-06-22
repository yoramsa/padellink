import { createClient, isConfigured } from "@/lib/supabase/server";
import type { Article, Adresse, Category, Publicite } from "@/lib/types";

const ARTICLE_SELECT =
  "*, categorie:categories(*), auteur:profiles(id, nom, avatar_url, role, created_at)";
const ADRESSE_SELECT = "*, categorie:categories(*)";

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("statut", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as Article[]) || [];
}

export async function getArticlesByType(
  type: string,
  limit = 12
): Promise<Article[]> {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select(`${ARTICLE_SELECT}, categories!inner(type)`)
    .eq("statut", "published")
    .eq("categories.type", type)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as Article[]) || [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("statut", "published")
    .maybeSingle();
  return (data as Article) || null;
}

export async function incrementVues(slug: string): Promise<void> {
  if (!isConfigured()) return;
  const supabase = createClient();
  await supabase.rpc("increment_article_vues", { article_slug: slug });
}

export async function getFeaturedAdresses(limit = 6): Promise<Adresse[]> {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("adresses")
    .select(ADRESSE_SELECT)
    .eq("statut", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Adresse[]) || [];
}

export async function getAdresses(limit = 60): Promise<Adresse[]> {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("adresses")
    .select(ADRESSE_SELECT)
    .eq("statut", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Adresse[]) || [];
}

export async function getAdresseBySlug(slug: string): Promise<Adresse | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("adresses")
    .select(ADRESSE_SELECT)
    .eq("slug", slug)
    .eq("statut", "published")
    .maybeSingle();
  return (data as Adresse) || null;
}

export async function getCategories(type?: string): Promise<Category[]> {
  if (!isConfigured()) return [];
  const supabase = createClient();
  let query = supabase.from("categories").select("*").order("nom");
  if (type) query = query.eq("type", type);
  const { data } = await query;
  return (data as Category[]) || [];
}

export async function getActivePublicite(
  emplacement: string
): Promise<Publicite | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("publicites")
    .select("*")
    .eq("emplacement", emplacement)
    .eq("actif", true)
    .or(`date_debut.is.null,date_debut.lte.${today}`)
    .or(`date_fin.is.null,date_fin.gte.${today}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Publicite) || null;
}
