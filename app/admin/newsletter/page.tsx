import { adminListNewsletter } from "@/lib/admin";
import { formatDate } from "@/lib/slug";
import DeleteForm from "@/components/admin/DeleteForm";
import NewsletterExport from "@/components/admin/NewsletterExport";
import { deleteNewsletter } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const abonnes = await adminListNewsletter();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-title text-3xl font-bold text-marine">
            Newsletter
          </h1>
          <p className="mt-1 text-sm text-marine/55">
            {abonnes.length} abonné{abonnes.length > 1 ? "s" : ""}
          </p>
        </div>
        <NewsletterExport abonnes={abonnes} />
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
        {abonnes.length ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-or/20 text-marine/55">
              <tr>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Prénom</th>
                <th className="px-5 py-3 font-semibold">Inscrit le</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {abonnes.map((a) => (
                <tr key={a.id} className="border-b border-or/10">
                  <td className="px-5 py-3 font-medium text-marine">{a.email}</td>
                  <td className="px-5 py-3 text-marine/65">{a.nom || "—"}</td>
                  <td className="px-5 py-3 text-marine/60">
                    {formatDate(a.created_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DeleteForm action={deleteNewsletter} id={a.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-sm text-marine/55">Aucun abonné.</p>
        )}
      </div>
    </div>
  );
}
