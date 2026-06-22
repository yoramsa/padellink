import { notFound } from "next/navigation";
import { adminGetAdresse, adminListCategories } from "@/lib/admin";
import AdresseForm from "@/components/admin/AdresseForm";
import { saveAdresse } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditAdressePage({
  params
}: {
  params: { id: string };
}) {
  const [adresse, categories] = await Promise.all([
    adminGetAdresse(params.id),
    adminListCategories()
  ]);

  if (!adresse) notFound();

  return (
    <div>
      <h1 className="mb-7 font-title text-3xl font-bold text-marine">
        Modifier l'adresse
      </h1>
      <AdresseForm
        adresse={adresse}
        categories={categories}
        action={saveAdresse}
      />
    </div>
  );
}
