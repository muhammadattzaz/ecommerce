import { apiClient } from './client';
import type { Product, Category } from '@/types/product';
import type { PaginatedResponse } from '@/types/api';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

function buildQuery(params: ProductQueryParams): string {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.category) q.set('category', params.category);
  if (params.minPrice !== undefined) q.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) q.set('maxPrice', String(params.maxPrice));
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.sort) q.set('sort', params.sort);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const productsApi = {
  getAll: (params: ProductQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Product>>(`/products${buildQuery(params)}`),

  getBySlug: (slug: string) => apiClient.get<Product>(`/products/slug/${slug}`),

  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),

  // Admin
  getAllAdmin: (params: ProductQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Product>>(`/products/admin${buildQuery(params)}`),

  create: (data: Partial<Product> & { category: string }) =>
    apiClient.post<Product>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    apiClient.patch<Product>(`/products/${id}`, data),

  remove: (id: string) => apiClient.delete<void>(`/products/${id}`),
};

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>('/categories'),

  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`),

  // Admin
  getAllAdmin: () => apiClient.get<Category[]>('/categories/admin'),

  create: (data: Partial<Category>) => apiClient.post<Category>('/categories', data),

  update: (id: string, data: Partial<Category>) =>
    apiClient.patch<Category>(`/categories/${id}`, data),

  remove: (id: string) => apiClient.delete<void>(`/categories/${id}`),
};
