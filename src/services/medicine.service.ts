import { API_BASE } from "@/lib/auth-client";
import type { ApiResponse, Category, Medicine, MedicineDetail } from "@/types/medicine.type";

export const medicineService = {
  getCategories: async (): Promise<{ data: Category[] | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        cache: "no-cache", 
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
        cache: "no-cache" 
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
       cache: "no-store"
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
  
createReview: async (data: {
    medicineId: string;
    rating: number;
    comment: string;
  }): Promise<{ data: any | null; error: string | null }> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // credentials: "include", // Remove this
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        return { data: result.data, error: null };
      }
      return { data: null, error: result.message || "Failed to create review" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },


};