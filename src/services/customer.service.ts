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

/* =======================
   Service
======================= */

export const customerService = {
  /* -------- Get logged-in user -------- */
//   getMe: async (): Promise<{ data: Me | null; error: string | null }> => {
//     try {
//       const res = await fetch(`${API_BASE}/auth/me`, {
//         credentials: "include",
//         cache: "no-store", // better than revalidate for auth
//       });
//       console.log(res);
//       const result: ApiResponse<Me> = await res.json();
//       console.log(result);
//       if (result.success) {
//         return { data: result.data, error: null };
//       }

//       return {
//         data: null,
//         error: result.message || "Failed to fetch user",
//       };
//     } catch (err) {
//       return { data: null, error: "Something went wrong" };
//     }
//   },

getMe: async () => {
  const res = await fetch("http://localhost:5000/api/auth/me", {
    credentials: "include",
  });
  return res.json();
},

  /* -------- Get customer orders -------- */
  getOrders: async (): Promise<{
    data: Order[] | null;
    pagination: Pagination | null;
    error: string | null;
  }> => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        credentials: "include",
        next: { revalidate: 0 },
      });

      const result: ApiResponse<Order[]> = await res.json();

      if (result.success) {
        return {
          data: result.data,
          pagination: result.pagination ?? null,
          error: null,
        };
      }

      return {
        data: null,
        pagination: null,
        error: result.message || "Failed to fetch orders",
      };
    } catch {
      return {
        data: null,
        pagination: null,
        error: "Something went wrong",
      };
    }
  },
};
