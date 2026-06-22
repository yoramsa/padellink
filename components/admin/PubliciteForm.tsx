"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

export default function PubliciteForm({
  action
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!image) {
      setError("Ajoutez une image.");
      return;
    }
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    fd.set("image", image);
    try {
      await action(fd);
      setImage("");
      e.currentTarget.reset();
    } catch {
      setError("Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="h-fit rounded-2xl border border-or/25 bg-white p-5 shadow-soft"
    >
      <h2 className="font-title text-lg font-bold text-marine">
        Nouvelle publicité
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        <input
          name="titre"
          placeholder="Titre (interne)"
          className="input-field rounded-xl px-4 py-2.5 text-sm"
        />
        <input
          name="lien"
          required
          placeholder="Lien (https://...)"
          className="input-field rounded-xl px-4 py-2.5 text-sm"
        />
        <select
          name="emplacement"
          className="input-field rounded-xl px-4 py-2.5 text-sm"
        >
          <option value="home">Accueil</option>
          <option value="article">Article</option>
          <option value="sidebar">Sidebar</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-marine/70">
              Début
            </label>
            <input
              name="date_debut"
              type="date"
              className="input-field w-full rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-marine/70">
              Fin
            </label>
            <input
              name="date_fin"
              type="date"
              className="input-field w-full rounded-xl px-3 py-2 text-sm"
            />
          </div>
        </div>
        <ImageUpload
          bucket="publicites"
          value={image}
          onChange={setImage}
          label="Visuel"
        />
        {error && <p className="text-sm font-medium text-mauve">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? "..." : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
