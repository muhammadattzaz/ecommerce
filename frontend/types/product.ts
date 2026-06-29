export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // pence
  stock: number;
  category: Category | string;
  imageUrl: string | null;
  images: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
