import Link from "next/link";
import type { Adresse } from "@/lib/types";

export default function AddressCard({ adresse }: { adresse: Adresse }) {
  const cat = adresse.categorie;
  return (
    <article className="card-rise overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
      <Link href={`/bonnes-adresses/${adresse.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-creme">
          {adresse.image ? (
            <img
              src={adresse.image}
              alt={adresse.nom}
              className="cover-zoom h-full w-full object-cover"
            />
          ) : (
            <div className="mosaic-band h-full w-full" />
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          {cat && (
            <span className="tag-pill rounded-full px-3 py-1 text-xs font-semibold">
              {cat.icone ? `${cat.icone} ` : ""}
              {cat.nom}
            </span>
          )}
          {adresse.prix_moyen && (
            <span className="text-xs font-medium text-or">{adresse.prix_moyen}</span>
          )}
        </div>
        <h3 className="mt-3 font-title text-xl font-bold text-marine">
          <Link href={`/bonnes-adresses/${adresse.slug}`} className="link-nav">
            {adresse.nom}
          </Link>
        </h3>
        {(adresse.ville || adresse.region) && (
          <p className="mt-1 text-sm text-marine/60">
            📍 {[adresse.ville, adresse.region].filter(Boolean).join(", ")}
          </p>
        )}
        {adresse.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-marine/70">
            {adresse.description}
          </p>
        )}
      </div>
    </article>
  );
}
