import { getActivePublicite } from "@/lib/queries";

export default async function AdBanner({
  emplacement
}: {
  emplacement: string;
}) {
  const pub = await getActivePublicite(emplacement);
  if (!pub) return null;

  return (
    <div className="mx-auto max-w-content px-5">
      <a
        href={pub.lien}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block overflow-hidden rounded-2xl border border-or/40 shadow-soft"
      >
        <img
          src={pub.image}
          alt={pub.titre || "Publicité"}
          className="h-auto w-full object-cover"
        />
      </a>
      <p className="mt-1 text-center text-[11px] uppercase tracking-widest text-marine/40">
        Publicité
      </p>
    </div>
  );
}
