import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdresseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const adresse = await getAdresseBySlug(params.slug);
  if (!adresse) return { title: "Adresse introuvable" };
  return {
    title: adresse.nom,
    description: adresse.description || undefined,
    openGraph: {
      title: adresse.nom,
      description: adresse.description || undefined,
      images: adresse.image ? [adresse.image] : undefined
    }
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-or/20 py-3">
      <span className="text-sm font-semibold text-marine/60">{label}</span>
      <span className="text-right text-sm text-marine">{value}</span>
    </div>
  );
}

export default async function AdressePage({
  params
}: {
  params: { slug: string };
}) {
  const adresse = await getAdresseBySlug(params.slug);
  if (!adresse) notFound();

  const gallery = adresse.images || [];

  return (
    <div className="mx-auto max-w-content px-5 py-12">
      <Link
        href="/bonnes-adresses"
        className="text-sm font-semibold text-azur hover:text-marine"
      >
        ← Toutes les adresses
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-or/25 shadow-soft">
            {adresse.image ? (
              <img
                src={adresse.image}
                alt={adresse.nom}
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="mosaic-band aspect-[16/9] w-full" />
            )}
          </div>

          {gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.slice(0, 6).map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-or/20"
                >
                  <img
                    src={src}
                    alt={`${adresse.nom} ${i + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-7">
            {adresse.categorie && (
              <span className="tag-pill rounded-full px-3 py-1 text-xs font-semibold">
                {adresse.categorie.icone ? `${adresse.categorie.icone} ` : ""}
                {adresse.categorie.nom}
              </span>
            )}
            <h1 className="mt-3 font-title text-4xl font-extrabold text-marine">
              {adresse.nom}
            </h1>
            {adresse.description && (
              <p className="mt-4 leading-relaxed text-marine/75">
                {adresse.description}
              </p>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-or/30 bg-white p-6 shadow-soft">
          <h2 className="font-title text-lg font-bold text-marine">
            Informations
          </h2>
          <div className="mt-3">
            {adresse.adresse && <InfoRow label="Adresse" value={adresse.adresse} />}
            {adresse.ville && <InfoRow label="Ville" value={adresse.ville} />}
            {adresse.region && <InfoRow label="Région" value={adresse.region} />}
            {adresse.horaires && (
              <InfoRow label="Horaires" value={adresse.horaires} />
            )}
            {adresse.prix_moyen && (
              <InfoRow label="Prix moyen" value={adresse.prix_moyen} />
            )}
            {adresse.telephone && (
              <InfoRow label="Téléphone" value={adresse.telephone} />
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {adresse.site_web && (
              <a
                href={adresse.site_web}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded-full px-5 py-2.5 text-center text-sm font-semibold"
              >
                Visiter le site web
              </a>
            )}
            {adresse.instagram && (
              <a
                href={adresse.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline rounded-full px-5 py-2.5 text-center text-sm font-semibold"
              >
                Instagram
              </a>
            )}
            {adresse.email && (
              <a
                href={`mailto:${adresse.email}`}
                className="btn-outline rounded-full px-5 py-2.5 text-center text-sm font-semibold"
              >
                Contacter par email
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
