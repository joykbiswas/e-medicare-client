import { API_BASE } from "@/lib/auth-client";

/* =======================
   Types
======================= */

export interface Me {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  imageUrl: string;
  categoryId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  quantity: number;
  price: number;
  medicine: Medicine;
}

export interface Order {
  id: string;
  customerId: string;
  status: "PROCESSING" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
}

export const customerService = {
  /* -------- Get logged-in user -------- */

getMe: async () => {
  const res = await fetch("http://localhost:5000/api/auth/me", {
    credentials: "include",
  });
  return res.json();
},

  /* -------- Get customer orders -------- */

getOrders: async (params?: { page?: number; limit?: number }): Promise<{ data: any[] | null; pagination: Pagination | null; error: string | null }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());
      
      const url = `http://localhost:5000/api/orders?${queryParams.toString()}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const result = await res.json();
      console.log(result);
      if (result.success) {
        return { data: result.data, pagination: result.pagination ?? null, error: null };
      }
      return { data: null, pagination: null, error: result.message || "Failed to fetch orders" };
    } catch (err) {
      return { data: null, pagination: null, error: "Something went wrong" };
    }
  },
};
