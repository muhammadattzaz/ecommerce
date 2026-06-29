import { apiClient } from './client';
import type { Order } from '@/types/order';
import type { PaginatedResponse } from '@/types/api';

export interface CreateOrderData {
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
}

export const ordersApi = {
  getMyOrders: () => apiClient.get<Order[]>('/orders/my'),

  getMyOrder: (id: string) => apiClient.get<Order>(`/orders/my/${id}`),

  createOrder: (data: CreateOrderData) => apiClient.post<Order>('/orders', data),

  // Admin
  getAllOrders: (params: { page?: number; limit?: number; status?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    if (params.status) q.set('status', params.status);
    const qs = q.toString();
    return apiClient.get<PaginatedResponse<Order>>(`/orders/admin${qs ? `?${qs}` : ''}`);
  },

  updateStatus: (id: string, status: string) =>
    apiClient.patch<Order>(`/orders/admin/${id}/status`, { status }),
};
