import { medicineService } from "@/services/medicine.service";
import { MedicineCard } from "@/components/modules/homepage/MedicineCard";
import { MedicinesPageClient } from "@/components/modules/medicines/MedicinesPageClient";
import { Suspense } from "react";

interface MedicinesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function MedicinesPage({ searchParams }: MedicinesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const categoryId = params.category;
  const search = params.search;

  const { data, error } = await medicineService.getMedicines({
    page,
    limit: 12,
    categoryId,
  });

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-destructive">Failed to load medicines. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <MedicinesPageClient
      initialMedicines={data.medicines}
      pagination={data.pagination}
      initialCategory={categoryId}
      initialSearch={search}
    />
  );
}