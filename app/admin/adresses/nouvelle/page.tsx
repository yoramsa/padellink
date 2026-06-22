import { adminListCategories } from "@/lib/admin";
import AdresseForm from "@/components/admin/AdresseForm";
import { saveAdresse } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewAdressePage() {
  const categories = await adminListCategories();

  return (
    <div>
      <h1 className="mb-7 font-title text-3xl font-bold text-marine">
        Nouvelle adresse
      </h1>
      <AdresseForm categories={categories} action={saveAdresse} />
    </div>
  );
}
