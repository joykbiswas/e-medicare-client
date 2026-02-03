import { API_BASE } from "@/lib/auth-client";
import type { ApiResponse } from "@/types/medicine.type";

export interface SellerOrder {
  id: string;
  customerId: string;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: SellerOrderItem[];
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SellerOrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    categoryId: string;
    sellerId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SellerOrdersResponse {
  orders: SellerOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

export const sellerService = {
  getOrders: async (): Promise<{ data: SellerOrdersResponse | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/seller/orders`, {
        headers: getAuthHeaders(),
        next: { revalidate: 0 },
      });
      const result: ApiResponse<SellerOrder[]> = await res.json();

      if (result.success) {
        return {
          data: {
            orders: result.data,
            pagination: result.pagination || {
              total: result.data.length,
              page: 1,
              limit: 10,
              totalPages: 1,
            },
          },
          error: null,
        };
      }
      return { data: null, error: "Failed to fetch orders" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },

  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<{ data: any | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (result.success) {
        return { data: result.data, error: null };
      }
      return { data: null, error: result.message || "Failed to update order status" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },

  getMedicines: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: { medicines: any[]; pagination: any } | null; error: string | null }> => {
    try {
      const url = new URL(`${API_BASE}/seller/medicines`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
        next: { revalidate: 0 },
      });
      const result: ApiResponse<any[]> = await res.json();

      if (result.success) {
        return {
          data: {
            medicines: result.data,
            pagination: result.pagination || {
              total: result.data.length,
              page: 1,
              limit: 10,
              totalPages: 1,
            },
          },
          error: null,
        };
      }
      return { data: null, error: "Failed to fetch medicines" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },

  addMedicine: async (data: any): Promise<{ data: any | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/seller/medicines`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        return { data: result.data, error: null };
      }
      return { data: null, error: result.message || "Failed to add medicine" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },

  updateMedicine: async (
    medicineId: string,
    data: any
  ): Promise<{ data: any | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/seller/medicines/${medicineId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        return { data: result.data, error: null };
      }
      return { data: null, error: result.message || "Failed to update medicine" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },

  deleteMedicine: async (
    medicineId: string
  ): Promise<{ data: any | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/seller/medicines/${medicineId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await res.json();

      if (result.success) {
        return { data: result.data, error: null };
      }
      return { data: null, error: result.message || "Failed to delete medicine" };
    } catch (err) {
      return { data: null, error: "Something went wrong" };
    }
  },
};