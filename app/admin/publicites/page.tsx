import { adminListPublicites } from "@/lib/admin";
import DeleteForm from "@/components/admin/DeleteForm";
import PubliciteForm from "@/components/admin/PubliciteForm";
import { createPublicite, togglePublicite, deletePublicite } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPublicitesPage() {
  const publicites = await adminListPublicites();

  return (
    <div>
      <h1 className="font-title text-3xl font-bold text-marine">Publicités</h1>

      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          {publicites.length ? (
            publicites.map((pub) => (
              <div
                key={pub.id}
                className="flex flex-col gap-4 rounded-2xl border border-or/25 bg-white p-4 shadow-soft sm:flex-row sm:items-center"
              >
                <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-or/20">
                  <img
                    src={pub.image}
                    alt={pub.titre || "pub"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-marine">
                    {pub.titre || "Sans titre"}
                  </p>
                  <p className="text-xs text-marine/55">
                    {pub.emplacement} · {pub.impressions} vues · {pub.clics} clics
                  </p>
                  <a
                    href={pub.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-azur hover:underline"
                  >
                    {pub.lien}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <form action={togglePublicite}>
                    <input type="hidden" name="id" value={pub.id} />
                    <input
                      type="hidden"
                      name="actif"
                      value={pub.actif ? "true" : "false"}
                    />
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${pub.actif ? "bg-azur/15 text-azur" : "bg-or/20 text-or"}`}
                    >
                      {pub.actif ? "Actif" : "Inactif"}
                    </button>
                  </form>
                  <DeleteForm action={deletePublicite} id={pub.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-or/40 bg-white/60 p-8 text-center text-sm text-marine/55">
              Aucune publicité.
            </p>
          )}
        </div>

        <PubliciteForm action={createPublicite} />
      </div>
    </div>
  );
}
