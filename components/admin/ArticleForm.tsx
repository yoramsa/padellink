"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article, Category, Tag } from "@/lib/types";
import { slugify } from "@/lib/slug";
import TiptapEditor from "./TiptapEditor";
import ImageUpload from "./ImageUpload";

export default function ArticleForm({
  article,
  categories,
  tags,
  selectedTagIds,
  action
}: {
  article?: Article;
  categories: Category[];
  tags: Tag[];
  selectedTagIds: string[];
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [titre, setTitre] = useState(article?.titre || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [extrait, setExtrait] = useState(article?.extrait || "");
  const [contenu, setContenu] = useState(article?.contenu || "");
  const [cover, setCover] = useState(article?.image_cover || "");
  const [categorieId, setCategorieId] = useState(article?.categorie_id || "");
  const [statut, setStatut] = useState(article?.statut || "draft");
  const [featured, setFeatured] = useState(article?.featured || false);
  const [tagIds, setTagIds] = useState<string[]>(selectedTagIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onTitre = (value: string) => {
    setTitre(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const toggleTag = (id: string) => {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!titre.trim() || !slug.trim()) {
      setError("Le titre et le slug sont obligatoires.");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    if (article) fd.set("id", article.id);
    fd.set("titre", titre.trim());
    fd.set("slug", slug.trim());
    fd.set("extrait", extrait);
    fd.set("contenu", contenu);
    fd.set("image_cover", cover);
    fd.set("categorie_id", categorieId);
    fd.set("statut", statut);
    fd.set("featured", featured ? "true" : "false");
    tagIds.forEach((id) => fd.append("tags", id));

    try {
      await action(fd);
    } catch (err) {
      setSaving(false);
      setError("Enregistrement impossible. Réessayez.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-7 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-marine">
            Titre
          </label>
          <input
            value={titre}
            onChange={(e) => onTitre(e.target.value)}
            className="input-field w-full rounded-xl px-4 py-3 text-base"
            placeholder="Titre de l'article"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-marine">
            Slug
          </label>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
            placeholder="slug-de-larticle"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-marine">
            Extrait
          </label>
          <textarea
            value={extrait}
            onChange={(e) => setExtrait(e.target.value)}
            rows={2}
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
            placeholder="Résumé court affiché dans les listes"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-marine">
            Contenu
          </label>
          <TiptapEditor value={contenu} onChange={setContenu} />
        </div>
      </div>

      <aside className="flex flex-col gap-5">
        <div className="rounded-2xl border border-or/25 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-marine">
                Statut
              </label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="input-field w-full rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-marine">
                Catégorie
              </label>
              <select
                value={categorieId}
                onChange={(e) => setCategorieId(e.target.value)}
                className="input-field w-full rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">— Choisir —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-marine">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4"
              />
              Article à la une
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-or/25 bg-white p-5 shadow-soft">
          <ImageUpload
            bucket="articles"
            value={cover}
            onChange={setCover}
            label="Image de couverture"
          />
        </div>

        {tags.length > 0 && (
          <div className="rounded-2xl border border-or/25 bg-white p-5 shadow-soft">
            <p className="mb-2 text-sm font-semibold text-marine">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${tagIds.includes(tag.id) ? "bg-azur text-creme" : "tag-pill"}`}
                >
                  {tag.nom}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm font-medium text-mauve">{error}</p>}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/articles")}
            className="btn-outline rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Annuler
          </button>
        </div>
      </aside>
    </form>
  );
}
