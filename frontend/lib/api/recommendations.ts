import { apiClient } from './client';
import type { Product } from '@/types/product';

export const recommendationsApi = {
  getFeatured: (limit = 8) =>
    apiClient.get<Product[]>(`/recommendations/featured?limit=${limit}`),

  getForMe: (limit = 8) =>
    apiClient.get<Product[]>(`/recommendations/for-me?limit=${limit}`),
};
