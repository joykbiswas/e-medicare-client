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
  }
  
  export interface MedicineDetail extends Medicine {
    seller: {
      name: string;
      email: string;
    };
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      userId: string;
      medicineId: string;
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