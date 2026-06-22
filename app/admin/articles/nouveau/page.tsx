import { adminListCategories, adminListTags } from "@/lib/admin";
import ArticleForm from "@/components/admin/ArticleForm";
import { saveArticle } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([
    adminListCategories(),
    adminListTags()
  ]);

  return (
    <div>
      <h1 className="mb-7 font-title text-3xl font-bold text-marine">
        Nouvel article
      </h1>
      <ArticleForm
        categories={categories}
        tags={tags}
        selectedTagIds={[]}
        action={saveArticle}
      />
    </div>
  );
}
