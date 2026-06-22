"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Adresse, Category } from "@/lib/types";
import { slugify } from "@/lib/slug";
import ImageUpload from "./ImageUpload";
import GalleryUpload from "./GalleryUpload";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-marine">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field w-full rounded-xl px-4 py-2.5 text-sm"
      />
    </div>
  );
}

export default function AdresseForm({
  adresse,
  categories,
  action
}: {
  adresse?: Adresse;
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [nom, setNom] = useState(adresse?.nom || "");
  const [slug, setSlug] = useState(adresse?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(adresse));
  const [description, setDescription] = useState(adresse?.description || "");
  const [categorieId, setCategorieId] = useState(adresse?.categorie_id || "");
  const [adresseTxt, setAdresseTxt] = useState(adresse?.adresse || "");
  const [ville, setVille] = useState(adresse?.ville || "");
  const [region, setRegion] = useState(adresse?.region || "");
  const [telephone, setTelephone] = useState(adresse?.telephone || "");
  const [siteWeb, setSiteWeb] = useState(adresse?.site_web || "");
  const [email, setEmail] = useState(adresse?.email || "");
  const [instagram, setInstagram] = useState(adresse?.instagram || "");
  const [horaires, setHoraires] = useState(adresse?.horaires || "");
  const [prixMoyen, setPrixMoyen] = useState(adresse?.prix_moyen || "");
  const [image, setImage] = useState(adresse?.image || "");
  const [images, setImages] = useState<string[]>(adresse?.images || []);
  const [statut, setStatut] = useState(adresse?.statut || "draft");
  const [featured, setFeatured] = useState(adresse?.featured || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onNom = (value: string) => {
    setNom(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nom.trim() || !slug.trim()) {
      setError("Le nom et le slug sont obligatoires.");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    if (adresse) fd.set("id", adresse.id);
    fd.set("nom", nom.trim());
    fd.set("slug", slug.trim());
    fd.set("description", description);
    fd.set("categorie_id", categorieId);
    fd.set("adresse", adresseTxt);
    fd.set("ville", ville);
    fd.set("region", region);
    fd.set("telephone", telephone);
    fd.set("site_web", siteWeb);
    fd.set("email", email);
    fd.set("instagram", instagram);
    fd.set("horaires", horaires);
    fd.set("prix_moyen", prixMoyen);
    fd.set("image", image);
    fd.set("statut", statut);
    fd.set("featured", featured ? "true" : "false");
    images.forEach((url) => fd.append("images", url));

    try {
      await action(fd);
    } catch {
      setSaving(false);
      setError("Enregistrement impossible. Réessayez.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-7 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-5">
        <Field label="Nom" name="nom" value={nom} onChange={onNom} placeholder="Nom du lieu" />
        <Field
          label="Slug"
          name="slug"
          value={slug}
          onChange={(v) => {
            setSlug(slugify(v));
            setSlugTouched(true);
          }}
        />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-marine">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adresse" name="adresse" value={adresseTxt} onChange={setAdresseTxt} />
          <Field label="Ville" name="ville" value={ville} onChange={setVille} />
          <Field label="Région" name="region" value={region} onChange={setRegion} />
          <Field label="Téléphone" name="telephone" value={telephone} onChange={setTelephone} />
          <Field label="Site web" name="site_web" value={siteWeb} onChange={setSiteWeb} />
          <Field label="Email" name="email" value={email} onChange={setEmail} />
          <Field label="Instagram" name="instagram" value={instagram} onChange={setInstagram} />
          <Field label="Prix moyen" name="prix_moyen" value={prixMoyen} onChange={setPrixMoyen} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-marine">
            Horaires
          </label>
          <textarea
            value={horaires}
            onChange={(e) => setHoraires(e.target.value)}
            rows={2}
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
            placeholder="Lun-Ven 9h-18h..."
          />
        </div>

        <div className="rounded-2xl border border-or/25 bg-white p-5 shadow-soft">
          <GalleryUpload value={images} onChange={setImages} />
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
                    {c.nom}
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
              Adresse mise en avant
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-or/25 bg-white p-5 shadow-soft">
          <ImageUpload
            bucket="adresses"
            value={image}
            onChange={setImage}
            label="Photo principale"
          />
        </div>

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
            onClick={() => router.push("/admin/adresses")}
            className="btn-outline rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Annuler
          </button>
        </div>
      </aside>
    </form>
  );
}
