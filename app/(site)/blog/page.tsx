import { getArticlesByType } from "@/lib/queries";
import ArticleCard from "@/components/ArticleCard";
import SectionHeader from "@/components/SectionHeader";
import EmptyNotice from "@/components/EmptyNotice";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description: "Récits, culture, conseils et témoignages de la communauté."
};

export default async function BlogPage() {
  const articles = await getArticlesByType("blog", 48);

  return (
    <div className="mx-auto max-w-content px-5 py-12">
      <SectionHeader
        title="Le Blog"
        subtitle="Récits, culture, conseils et témoignages"
      />
      {articles.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} basePath="/blog" />
          ))}
        </div>
      ) : (
        <EmptyNotice label="Aucun billet publié pour le moment." />
      )}
    </div>
  );
}
