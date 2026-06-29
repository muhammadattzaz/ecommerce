'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/storefront/product-card';
import { useFeaturedProducts, usePersonalisedRecommendations } from '@/lib/hooks/use-recommendations';
import { ROUTES } from '@/lib/routes';
import type { Product } from '@/types/product';

interface ProductRecommendationsProps {
  currentProductId: string;
}

export function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  const { data: personalised, isError: notLoggedIn, isLoading: personLoading } = usePersonalisedRecommendations(9);
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts(9);

  const usePersonalised = !notLoggedIn && !!personalised?.length;
  const products: Product[] = (usePersonalised ? personalised : featured ?? [])
    .filter((p: Product) => p._id !== currentProductId)
    .slice(0, 6);

  const isLoading = usePersonalised ? personLoading : featuredLoading;

  if (!isLoading && products.length === 0) return null;

  const subtitle = usePersonalised ? 'Just for you' : 'Popular picks';

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#0F3460] text-white text-[10px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-wide select-none">
            ★
          </span>
          <h2 className="text-[16px] font-bold text-gray-800">Recommended for You</h2>
          <span className="text-[13px] text-[#F57224] border-b border-[#F57224] leading-none ml-1 hidden sm:inline">
            {subtitle}
          </span>
        </div>
        <Link
          href={ROUTES.PRODUCTS}
          className="text-[12px] font-semibold text-[#F57224] border border-[#F57224] px-3 py-1.5 rounded-[3px] hover:bg-[#FFF3EC] transition-colors uppercase tracking-wide shrink-0"
        >
          SHOP ALL PRODUCTS →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sf-shimmer w-[175px] shrink-0 h-[260px] rounded-[4px]" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {products.map((p: Product) => (
            <ProductCard
              key={p._id}
              name={p.name}
              slug={p.slug}
              price={p.price}
              imageUrl={p.imageUrl}
              rating={p.rating}
              reviewCount={p.reviewCount}
              className="w-[175px] shrink-0"
            />
          ))}
        </div>
      )}
    </section>
  );
}
