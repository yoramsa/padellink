import { getArticlesByType } from "@/lib/queries";
import ArticleCard from "@/components/ArticleCard";
import SectionHeader from "@/components/SectionHeader";
import EmptyNotice from "@/components/EmptyNotice";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News",
  description: "Toute l'actualité de la communauté francophone en Israël."
};

export default async function NewsPage() {
  const articles = await getArticlesByType("news", 48);

  return (
    <div className="mx-auto max-w-content px-5 py-12">
      <SectionHeader
        title="News"
        subtitle="L'actualité de la communauté francophone en Israël"
      />
      {articles.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} basePath="/news" />
          ))}
        </div>
      ) : (
        <EmptyNotice label="Aucun article publié pour le moment." />
      )}
    </div>
  );
}
