export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medicine {
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
  category: Category;
  seller: {
    id: string;
    name: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    userId: string;
    user: {
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface MedicineDetail extends Omit<Medicine, 'reviews'> {
  seller: {
    id: string;
    name: string;
    email: string;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    userId: string;
    user: {
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}