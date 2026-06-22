import { getAdresses } from "@/lib/queries";
import AddressCard from "@/components/AddressCard";
import SectionHeader from "@/components/SectionHeader";
import EmptyNotice from "@/components/EmptyNotice";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bonnes adresses",
  description:
    "Restaurants, cafés et services recommandés par la communauté francophone en Israël."
};

export default async function AdressesPage() {
  const adresses = await getAdresses(60);

  return (
    <div className="mx-auto max-w-content px-5 py-12">
      <SectionHeader
        title="Bonnes adresses"
        subtitle="Les lieux et services préférés de la communauté"
      />
      {adresses.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adresses.map((adresse) => (
            <AddressCard key={adresse.id} adresse={adresse} />
          ))}
        </div>
      ) : (
        <EmptyNotice label="Aucune adresse publiée pour le moment." />
      )}
    </div>
  );
}
