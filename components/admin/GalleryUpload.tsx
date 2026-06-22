"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload";

export default function GalleryUpload({
  value,
  onChange
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    const added: string[] = [];
    for (const file of files) {
      try {
        const url = await uploadImage("adresses", file);
        added.push(url);
      } catch {
        continue;
      }
    }
    onChange([...value, ...added]);
    setBusy(false);
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-marine">
        Galerie photos
      </label>
      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {value.map((url) => (
            <div
              key={url}
              className="relative overflow-hidden rounded-lg border border-or/30"
            >
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute right-1 top-1 rounded-full bg-marine/80 px-2 py-0.5 text-xs font-bold text-creme"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onFiles}
        className="block w-full text-sm text-marine/70 file:mr-3 file:rounded-full file:border-0 file:bg-azur file:px-4 file:py-2 file:text-sm file:font-semibold file:text-creme"
      />
      {busy && <p className="mt-2 text-sm text-azur">Envoi en cours...</p>}
    </div>
  );
}
