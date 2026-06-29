import { apiClient } from './client';
import type { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export const cartApi = {
  getCart: () => apiClient.get<Cart>('/cart'),

  addItem: (data: { productId: string; quantity: number }) =>
    apiClient.post<Cart>('/cart/items', data),

  updateItem: (productId: string, quantity: number) =>
    apiClient.patch<Cart>(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: string) => apiClient.delete<Cart>(`/cart/items/${productId}`),

  clearCart: () => apiClient.delete<void>('/cart'),
};
