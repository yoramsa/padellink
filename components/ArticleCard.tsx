import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/slug";

export default function ArticleCard({
  article,
  basePath
}: {
  article: Article;
  basePath: string;
}) {
  const cat = article.categorie;
  return (
    <article className="card-rise overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
      <Link href={`${basePath}/${article.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-creme">
          {article.image_cover ? (
            <img
              src={article.image_cover}
              alt={article.titre}
              className="cover-zoom h-full w-full object-cover"
            />
          ) : (
            <div className="mosaic-band h-full w-full" />
          )}
        </div>
      </Link>
      <div className="p-5">
        {cat && (
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: `${cat.couleur || "#4A6FD4"}1a`,
              color: cat.couleur || "#4A6FD4"
            }}
          >
            {cat.icone ? `${cat.icone} ` : ""}
            {cat.nom}
          </span>
        )}
        <h3 className="mt-3 font-title text-xl font-bold leading-snug text-marine">
          <Link href={`${basePath}/${article.slug}`} className="link-nav">
            {article.titre}
          </Link>
        </h3>
        {article.extrait && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-marine/70">
            {article.extrait}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 text-xs text-marine/50">
          <span>{formatDate(article.published_at || article.created_at)}</span>
          <span>·</span>
          <span>{article.vues} vues</span>
        </div>
      </div>
    </article>
  );
}
