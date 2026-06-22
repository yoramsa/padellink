import Link from "next/link";
import { adminListArticles } from "@/lib/admin";
import { formatDate } from "@/lib/slug";
import DeleteForm from "@/components/admin/DeleteForm";
import { deleteArticle } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await adminListArticles();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-title text-3xl font-bold text-marine">Articles</h1>
        <Link
          href="/admin/articles/nouveau"
          className="btn-gold rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          + Nouvel article
        </Link>
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
        {articles.length ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-or/20 text-marine/55">
              <tr>
                <th className="px-5 py-3 font-semibold">Titre</th>
                <th className="px-5 py-3 font-semibold">Catégorie</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold">Vues</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-or/10">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="font-medium text-marine hover:text-azur"
                    >
                      {article.titre}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-marine/65">
                    {article.categorie?.nom || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${article.statut === "published" ? "bg-azur/15 text-azur" : "bg-or/20 text-or"}`}
                    >
                      {article.statut === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-marine/70">{article.vues}</td>
                  <td className="px-5 py-3 text-marine/60">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DeleteForm action={deleteArticle} id={article.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-sm text-marine/55">
            Aucun article. Créez le premier.
          </p>
        )}
      </div>
    </div>
  );
}
