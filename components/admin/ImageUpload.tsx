"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload";

export default function ImageUpload({
  bucket,
  value,
  onChange,
  label
}: {
  bucket: string;
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await uploadImage(bucket, file);
      onChange(url);
    } catch {
      setError("Échec de l'envoi. Vérifiez la configuration Supabase Storage.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-marine">
        {label}
      </label>
      {value && (
        <div className="mb-3 overflow-hidden rounded-xl border border-or/30">
          <img src={value} alt="aperçu" className="h-40 w-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="block w-full text-sm text-marine/70 file:mr-3 file:rounded-full file:border-0 file:bg-azur file:px-4 file:py-2 file:text-sm file:font-semibold file:text-creme"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-sm font-medium text-mauve"
          >
            Retirer
          </button>
        )}
      </div>
      {busy && <p className="mt-2 text-sm text-azur">Envoi en cours...</p>}
      {error && <p className="mt-2 text-sm text-mauve">{error}</p>}
    </div>
  );
}
