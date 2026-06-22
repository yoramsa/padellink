import { adminListCategories } from "@/lib/admin";
import DeleteForm from "@/components/admin/DeleteForm";
import { createCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await adminListCategories();

  return (
    <div>
      <h1 className="font-title text-3xl font-bold text-marine">Catégories</h1>

      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
          {categories.length ? (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-or/20 text-marine/55">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nom</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Couleur</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-or/10">
                    <td className="px-5 py-3 font-medium text-marine">
                      {cat.icone ? `${cat.icone} ` : ""}
                      {cat.nom}
                    </td>
                    <td className="px-5 py-3 text-marine/65">{cat.type}</td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-block h-4 w-4 rounded-full"
                        style={{ backgroundColor: cat.couleur || "#4A6FD4" }}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <DeleteForm action={deleteCategory} id={cat.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-sm text-marine/55">Aucune catégorie.</p>
          )}
        </div>

        <form
          action={createCategory}
          className="h-fit rounded-2xl border border-or/25 bg-white p-5 shadow-soft"
        >
          <h2 className="font-title text-lg font-bold text-marine">
            Nouvelle catégorie
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <input
              name="nom"
              required
              placeholder="Nom"
              className="input-field rounded-xl px-4 py-2.5 text-sm"
            />
            <select
              name="type"
              className="input-field rounded-xl px-4 py-2.5 text-sm"
            >
              <option value="news">news</option>
              <option value="blog">blog</option>
              <option value="adresse">adresse</option>
            </select>
            <input
              name="icone"
              placeholder="Icône (emoji)"
              className="input-field rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              name="couleur"
              type="color"
              defaultValue="#4A6FD4"
              className="input-field h-11 rounded-xl px-2 py-1"
            />
            <button
              type="submit"
              className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
