"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MedicineCard } from "@/components/modules/homepage/MedicineCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Filter, X } from "lucide-react";
import type { Medicine } from "@/types/medicine.type";
import { medicineService } from "@/services/medicine.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface MedicinesPageClientProps {
  initialMedicines: Medicine[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  initialCategory?: string;
  initialSearch?: string;
}

export function MedicinesPageClient({
  initialMedicines,
  pagination: initialPagination,
  initialCategory,
  initialSearch,
}: MedicinesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch categories on mount
  useEffect(() => {
    medicineService.getCategories().then(({ data }) => {
      if (data) {
        setCategories(data);
      }
    });
  }, []);

  // Filter medicines client-side based on search
  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return medicines;

    const query = searchQuery.toLowerCase();
    return medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(query) ||
        medicine.manufacturer.toLowerCase().includes(query) ||
        medicine.description?.toLowerCase().includes(query) ||
        medicine.category.name.toLowerCase().includes(query)
    );
  }, [medicines, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to page 1 on new search
    router.push(`/medicines?${params.toString()}`);
  };

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);

    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/medicines?${params.toString()}`);

    // Fetch filtered medicines
    const { data, error } = await medicineService.getMedicines({
      page: 1,
      limit: 12,
      categoryId: categoryId || undefined,
    });

    if (data && !error) {
      setMedicines(data.medicines);
      setPagination(data.pagination);
    }
    setLoading(false);
  };

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/medicines?${params.toString()}`);

    const { data, error } = await medicineService.getMedicines({
      page: newPage,
      limit: 12,
      categoryId: selectedCategory || undefined,
    });

    if (data && !error) {
      setMedicines(data.medicines);
      setPagination(data.pagination);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    router.push("/medicines");
    // Reload medicines without filters
    setLoading(true);
    medicineService.getMedicines({ page: 1, limit: 12 }).then(({ data, error }) => {
      if (data && !error) {
        setMedicines(data.medicines);
        setPagination(data.pagination);
      }
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            All Medicines
          </h1>
          <p className="text-muted-foreground">
            Browse our complete collection of pharmaceutical products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines, manufacturer, or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory) && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredMedicines.length} of {pagination.total} medicines
          </div>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-4 space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">No medicines found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      pageNum === pagination.page - 2 ||
                      pageNum === pagination.page + 2
                    ) {
                      return <span key={pageNum}>...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}