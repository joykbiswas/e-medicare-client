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

export const sellerService = {
  getOrders: async (): Promise<{ data: SellerOrdersResponse | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/seller/orders`, {
        credentials: "include",
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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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

  getMedicines: async (): Promise<{ data: any[] | null; error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/seller/medicines`, {
        credentials: "include",
        next: { revalidate: 0 },
      });
      const result: ApiResponse<any[]> = await res.json();

      if (result.success) {
        return { data: result.data, error: null };
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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
        credentials: "include",
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
