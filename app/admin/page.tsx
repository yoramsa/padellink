import Link from "next/link";
import { adminStats, adminListArticles } from "@/lib/admin";
import { formatDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await adminStats();
  const recent = (await adminListArticles()).slice(0, 6);

  const cards = [
    { label: "Articles publiés", value: stats.articles },
    { label: "Vues totales", value: stats.vues },
    { label: "Bonnes adresses", value: stats.adresses },
    { label: "Abonnés newsletter", value: stats.abonnes }
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-title text-3xl font-bold text-marine">
          Tableau de bord
        </h1>
        <Link
          href="/admin/articles/nouveau"
          className="btn-gold rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          + Nouvel article
        </Link>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-or/25 bg-white p-6 shadow-soft"
          >
            <p className="text-sm text-marine/55">{card.label}</p>
            <p className="mt-2 font-title text-4xl font-extrabold text-marine">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-title text-xl font-bold text-marine">
          Derniers articles
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
          {recent.length ? (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-or/20 text-marine/55">
                <tr>
                  <th className="px-5 py-3 font-semibold">Titre</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                  <th className="px-5 py-3 font-semibold">Vues</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((article) => (
                  <tr key={article.id} className="border-b border-or/10">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="font-medium text-marine hover:text-azur"
                      >
                        {article.titre}
                      </Link>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-sm text-marine/55">
              Aucun article pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
