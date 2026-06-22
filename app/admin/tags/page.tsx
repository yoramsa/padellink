import { adminListTags } from "@/lib/admin";
import DeleteForm from "@/components/admin/DeleteForm";
import { createTag, deleteTag } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await adminListTags();

  return (
    <div>
      <h1 className="font-title text-3xl font-bold text-marine">Tags</h1>

      <form
        action={createTag}
        className="mt-7 flex max-w-md gap-3 rounded-2xl border border-or/25 bg-white p-5 shadow-soft"
      >
        <input
          name="nom"
          required
          placeholder="Nouveau tag"
          className="input-field flex-1 rounded-xl px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          Ajouter
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {tags.length ? (
          tags.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-2 rounded-full border border-or/30 bg-white px-4 py-2 text-sm font-medium text-marine shadow-soft"
            >
              {tag.nom}
              <DeleteForm action={deleteTag} id={tag.id} label="✕" message="Supprimer ce tag ?" />
            </span>
          ))
        ) : (
          <p className="text-sm text-marine/55">Aucun tag.</p>
        )}
      </div>
    </div>
  );
}
