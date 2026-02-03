import { HeroSection } from "@/components/modules/homepage/HeroSection";
import { MedicinesSection } from "@/components/modules/homepage/MedicinesSection";
import { CategoriesSection } from "@/components/modules/homepage/CategoriesSection";
import { FeaturesSection } from "@/components/modules/homepage/FeaturesSection";
import { Footer } from "@/components/shared/footer";
import { medicineService } from "@/services/medicine.service";
import ReviewSection from "@/components/modules/homepage/ReviewSection";

export default async function Home() {
  // Fetch data in parallel
  const [categoriesResult, medicinesResult] = await Promise.all([
    medicineService.getCategories(),
    medicineService.getMedicines({ limit: 12 }),
  ]);

  const categories = categoriesResult.data || [];
  const medicines = medicinesResult.data?.medicines || [];

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <MedicinesSection medicines={medicines} />
      <ReviewSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}