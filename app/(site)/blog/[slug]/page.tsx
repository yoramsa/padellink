import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, incrementVues } from "@/lib/queries";
import ArticleView from "@/components/ArticleView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.titre,
    description: article.extrait || undefined,
    openGraph: {
      title: article.titre,
      description: article.extrait || undefined,
      images: article.image_cover ? [article.image_cover] : undefined,
      type: "article"
    }
  };
}

export default async function BlogArticlePage({
  params
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();
  await incrementVues(params.slug);

  return (
    <ArticleView article={article} backHref="/blog" backLabel="Tout le blog" />
  );
}
