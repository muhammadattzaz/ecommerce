'use client';

import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '@/lib/api/recommendations';

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ['recommendations', 'featured', limit],
    queryFn: () => recommendationsApi.getFeatured(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePersonalisedRecommendations(limit = 8) {
  return useQuery({
    queryKey: ['recommendations', 'for-me', limit],
    queryFn: () => recommendationsApi.getForMe(limit),
    staleTime: 1000 * 60 * 5,
    retry: false, // 401 means not logged in — don't retry
  });
}
