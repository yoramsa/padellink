import Link from "next/link";
import { adminListAdresses } from "@/lib/admin";
import DeleteForm from "@/components/admin/DeleteForm";
import { deleteAdresse } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminAdressesPage() {
  const adresses = await adminListAdresses();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-title text-3xl font-bold text-marine">
          Bonnes adresses
        </h1>
        <Link
          href="/admin/adresses/nouvelle"
          className="btn-gold rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          + Nouvelle adresse
        </Link>
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
        {adresses.length ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-or/20 text-marine/55">
              <tr>
                <th className="px-5 py-3 font-semibold">Nom</th>
                <th className="px-5 py-3 font-semibold">Catégorie</th>
                <th className="px-5 py-3 font-semibold">Ville</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {adresses.map((adresse) => (
                <tr key={adresse.id} className="border-b border-or/10">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/adresses/${adresse.id}`}
                      className="font-medium text-marine hover:text-azur"
                    >
                      {adresse.nom}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-marine/65">
                    {adresse.categorie?.nom || "—"}
                  </td>
                  <td className="px-5 py-3 text-marine/65">
                    {adresse.ville || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${adresse.statut === "published" ? "bg-azur/15 text-azur" : "bg-or/20 text-or"}`}
                    >
                      {adresse.statut === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DeleteForm action={deleteAdresse} id={adresse.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-sm text-marine/55">Aucune adresse.</p>
        )}
      </div>
    </div>
  );
}
