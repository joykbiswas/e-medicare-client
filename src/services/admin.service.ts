import { API_BASE } from "@/lib/auth-client";

const ADMIN_API_BASE = `${API_BASE}/admin`;

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
  isBanned: boolean;
  createdAt: string;
}

export interface AdminMedicine {
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
  category: {
    id: string;
    name: string;
  };
  seller: {
    id: string;
    name: string;
  };
  reviews: unknown[];
}

export interface AdminOrder {
  id: string;
  customerId: string;
  status: string;
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    orderId: string;
    medicineId: string;
    quantity: number;
    price: number;
    medicine: AdminMedicine;
  }>;
}

export interface AdminCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const getHeaders = () => ({
  "Content-Type": "application/json",
});

export const adminService = {
  // Users
  async getUsers(page = 1, limit = 10): Promise<{ users: AdminUser[]; pagination: PaginationData }> {
    const response = await fetch(`${ADMIN_API_BASE}/users?page=${page}&limit=${limit}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    const data = await response.json();
    return {
      users: data.data,
      pagination: data.pagination || { total: 0, page: 1, limit, totalPages: 1 },
    };
  },

  async updateUser(userId: string, status: string, isBanned: boolean): Promise<AdminUser> {
    const response = await fetch(`${ADMIN_API_BASE}/users/${userId}`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ status, isBanned }),
    });
    const data = await response.json();
    return data.data;
  },

  // Medicines
  async getMedicines(page = 1, limit = 10): Promise<{ medicines: AdminMedicine[]; pagination: PaginationData }> {
    const response = await fetch(`${ADMIN_API_BASE}/medicines?page=${page}&limit=${limit}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    const data = await response.json();
    return {
      medicines: data.data,
      pagination: data.pagination || { total: 0, page: 1, limit, totalPages: 1 },
    };
  },

  async deleteMedicine(medicineId: string): Promise<void> {
    await fetch(`${ADMIN_API_BASE}/medicines/${medicineId}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
  },

  // Orders
  async getOrders(page = 1, limit = 10): Promise<{ orders: AdminOrder[]; pagination: PaginationData }> {
    const response = await fetch(`${ADMIN_API_BASE}/orders?page=${page}&limit=${limit}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    const data = await response.json();
    return {
      orders: data.data,
      pagination: data.pagination || { total: 0, page: 1, limit, totalPages: 1 },
    };
  },

  async updateOrderStatus(orderId: string, status: string): Promise<AdminOrder> {
    const response = await fetch(`${ADMIN_API_BASE}/orders/${orderId}`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data.data;
  },

  // Categories
  async getCategories(): Promise<AdminCategory[]> {
    const response = await fetch(`${ADMIN_API_BASE}/categories`, {
      headers: getHeaders(),
      credentials: "include",
    });
    const data = await response.json();
    return data.data;
  },

  async createCategory(name: string): Promise<AdminCategory> {
    const response = await fetch(`${ADMIN_API_BASE}/categories`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    return data.data;
  },

  async updateCategory(categoryId: string, name: string): Promise<AdminCategory> {
    const response = await fetch(`${ADMIN_API_BASE}/categories/${categoryId}`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    return data.data;
  },

  async deleteCategory(categoryId: string): Promise<void> {
    await fetch(`${ADMIN_API_BASE}/categories/${categoryId}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
  },
};
