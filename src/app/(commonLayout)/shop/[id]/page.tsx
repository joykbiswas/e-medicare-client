import { medicineService } from "@/services/medicine.service";
// import { MedicineDetailComponent } from "@/components/modules/shop/ShopDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MedicineDetailComponent } from "@/components/modules/Medicine/MedicineDetail";
// import { ShopDetailComponent } from "@/components/modules/Medicine/MedicineDetail";

interface MedicinePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MedicinePageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: medicine } = await medicineService.getMedicineById(id);

  if (!medicine) {
    return {
      title: "Medicine Not Found",
    };
  }

  return {
    title: `${medicine.name} - E-Medicare`,
    description: medicine.description || `Buy ${medicine.name} online from E-Medicare`,
  };
}

export default async function MedicinePage({ params }: MedicinePageProps) {
  const { id } = await params;
  const { data: medicine, error } = await medicineService.getMedicineById(id);

  if (error || !medicine) {
    notFound();
  }

  return <MedicineDetailComponent medicine={medicine} />;
}