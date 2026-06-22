import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/slug";
import NewsletterForm from "./NewsletterForm";

export default function ArticleView({
  article,
  backHref,
  backLabel
}: {
  article: Article;
  backHref: string;
  backLabel: string;
}) {
  const cat = article.categorie;
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link
        href={backHref}
        className="text-sm font-semibold text-azur hover:text-marine"
      >
        ← {backLabel}
      </Link>

      <header className="mt-6">
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
        <h1 className="mt-4 font-title text-4xl font-extrabold leading-tight text-marine">
          {article.titre}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-marine/55">
          {article.auteur?.nom && <span>Par {article.auteur.nom}</span>}
          {article.auteur?.nom && <span>·</span>}
          <span>{formatDate(article.published_at || article.created_at)}</span>
          <span>·</span>
          <span>{article.vues} vues</span>
        </div>
      </header>

      {article.image_cover && (
        <div className="mt-7 overflow-hidden rounded-2xl border border-or/25 shadow-soft">
          <img
            src={article.image_cover}
            alt={article.titre}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {article.extrait && (
        <p className="mt-7 border-l-4 border-or pl-4 font-title text-xl italic leading-relaxed text-marine/80">
          {article.extrait}
        </p>
      )}

      <div
        className="prose-content mt-7"
        dangerouslySetInnerHTML={{ __html: article.contenu || "" }}
      />

      <div className="gold-rule mt-12 h-0.5 w-full" />

      <div className="mt-8 rounded-2xl border border-or/30 bg-white p-7 text-center shadow-soft">
        <h2 className="font-title text-xl font-bold text-marine">
          Ne manquez aucun article
        </h2>
        <p className="mt-2 text-sm text-marine/60">
          Inscrivez-vous à la newsletter de Mazaly.
        </p>
        <div className="mt-5">
          <NewsletterForm compact />
        </div>
      </div>
    </article>
  );
}
