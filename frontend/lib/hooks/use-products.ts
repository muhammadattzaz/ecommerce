'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@/lib/api/products';
import type { ProductQueryParams } from '@/lib/api/products';

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => productsApi.getBySlug(slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 1000 * 60 * 10,
  });
}

export function useProductsAdmin(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ['products', 'admin', params],
    queryFn: () => productsApi.getAllAdmin(params),
    staleTime: 1000 * 60 * 1,
  });
}

// Admin mutations
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof productsApi.update>[1] }) =>
      productsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
