import { notFound } from "next/navigation";
import {
  adminGetArticle,
  adminGetArticleTagIds,
  adminListCategories,
  adminListTags
} from "@/lib/admin";
import ArticleForm from "@/components/admin/ArticleForm";
import { saveArticle } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params
}: {
  params: { id: string };
}) {
  const [article, categories, tags] = await Promise.all([
    adminGetArticle(params.id),
    adminListCategories(),
    adminListTags()
  ]);

  if (!article) notFound();
  const selectedTagIds = await adminGetArticleTagIds(article.id);

  return (
    <div>
      <h1 className="mb-7 font-title text-3xl font-bold text-marine">
        Modifier l'article
      </h1>
      <ArticleForm
        article={article}
        categories={categories}
        tags={tags}
        selectedTagIds={selectedTagIds}
        action={saveArticle}
      />
    </div>
  );
}
