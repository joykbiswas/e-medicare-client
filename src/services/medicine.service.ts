import { API_BASE } from "@/lib/auth-client";
import type { ApiResponse, Category, Medicine, MedicineDetail } from "@/types/medicine.type";

export const medicineService = {
  getCategories: async (): Promise<{ data: Category[] | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        next: { revalidate: 3600 }, // Revalidate every hour
      });
      const result: ApiResponse<Category[]> = await res.json();
      
      if (result.success) {
        return { data: result.data, error: null };
      }
      return { data: null, error: "Failed to fetch categories" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },

  getMedicines: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
  }): Promise<{ data: { medicines: Medicine[]; pagination: any } | null; error: string | null }> => {
    try {
      const url = new URL(`${API_BASE}/medicines`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const res = await fetch(url.toString(), {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      const result: ApiResponse<Medicine[]> = await res.json();
      
      if (result.success) {
        return {
          data: {
            medicines: result.data,
            pagination: result.pagination,
          },
          error: null,
        };
      }
      return { data: null, error: "Failed to fetch medicines" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },

  getMedicineById: async (id: string): Promise<{ data: MedicineDetail | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/medicines/${id}`, {
        next: { revalidate: 300 },
      });
      const result: ApiResponse<MedicineDetail> = await res.json();
      
      if (result.success) {
        return { data: result.data, error: null };
      }
      return { data: null, error: "Failed to fetch medicine" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },
};