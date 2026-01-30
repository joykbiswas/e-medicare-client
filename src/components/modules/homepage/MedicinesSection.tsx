import { MedicineCard } from "./MedicineCard";
import { Button } from "@/components/ui/button";
import type { Medicine } from "@/types/medicine.type";
import Link from "next/link";

interface MedicinesSectionProps {
  medicines: Medicine[];
}

export function MedicinesSection({ medicines }: MedicinesSectionProps) {
  return (
    <section id="medicines" className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Featured Medicines
            </h2>
            <p className="text-muted-foreground mt-2">
              Browse our collection of trusted pharmaceutical products
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/medicines">View All</Link>
          </Button>
        </div>

        {medicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No medicines available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}