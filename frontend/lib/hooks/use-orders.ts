'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import type { CreateOrderData } from '@/lib/api/orders';

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: ordersApi.getMyOrders,
    staleTime: 1000 * 60,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getMyOrder(id),
    staleTime: 1000 * 60,
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderData) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Admin
export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ['orders', 'admin', id],
    queryFn: () => ordersApi.getAdminOrder(id),
    staleTime: 1000 * 60,
    enabled: !!id,
  });
}

export function useAllOrders(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ['orders', 'admin', params],
    queryFn: () => ordersApi.getAllOrders(params),
    staleTime: 1000 * 60,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}
