'use client';

import Link from 'next/link';
import { ChevronRight, Truck, Zap, ShoppingBag, Star } from 'lucide-react';
import { useCategories, useProducts } from '@/lib/hooks/use-products';
import { ProductCard } from '@/components/storefront/product-card';
import { ROUTES } from '@/lib/routes';
import type { Category, Product } from '@/types/product';

const CATEGORY_ICONS: Record<string, string> = {
  electronics: '📱',
  clothing: '👕',
  books: '📚',
  'home-garden': '🏡',
  sports: '⚽',
};

const TRUST_BADGES = [
  { icon: Truck, label: 'Free Delivery', sub: 'On orders over £50' },
  { icon: Zap, label: 'Flash Deals', sub: 'New deals every day' },
  { icon: ShoppingBag, label: 'Easy Returns', sub: '30-day return policy' },
  { icon: Star, label: 'Top Rated', sub: 'Verified reviews only' },
];

function ProductGrid({ isLoading, products }: { isLoading: boolean; products?: Product[] }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="sf-shimmer aspect-[3/4] rounded-[4px]" />
        ))}
      </div>
    );
  }
  if (!products?.length) {
    return (
      <div className="py-10 text-center text-[13px] text-gray-400 bg-white border border-[#E8E8E8] rounded-[4px]">
        No products found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {products.map((p) => (
        <ProductCard
          key={p._id}
          name={p.name}
          slug={p.slug}
          price={p.price}
          imageUrl={p.imageUrl}
          rating={p.rating}
          reviewCount={p.reviewCount}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: popularData, isLoading: popularLoading } = useProducts({ sort: 'popular', limit: 8 });
  const { data: latestData, isLoading: latestLoading } = useProducts({ sort: 'newest', limit: 8 });

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4 space-y-4">

      {/* ── Hero + category sidebar ── */}
      <div className="flex gap-3 items-stretch">
        {/* Category sidebar — desktop only */}
        <aside className="hidden lg:block w-48 shrink-0 bg-white border border-[#E8E8E8] rounded-[4px] self-start overflow-hidden">
          {catLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="sf-shimmer h-9 mx-3 my-1.5 rounded" />
              ))
            : categories?.map((cat: Category) => (
                <Link
                  key={cat._id}
                  href={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
                  className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#FFF3EC] hover:text-[#F57224] transition-colors border-b border-[#F5F5F5] last:border-0"
                >
                  <span>{cat.name}</span>
                  <ChevronRight size={12} className="text-gray-300" />
                </Link>
              ))}
        </aside>

        {/* Hero banner */}
        <div
          className="flex-1 rounded-[4px] relative overflow-hidden flex flex-col justify-center px-8 py-10"
          style={{ background: 'linear-gradient(135deg, #F57224 0%, #D45A0F 100%)' }}
        >
          <p className="text-white/80 text-[12px] font-semibold uppercase tracking-widest mb-2">
            Welcome to
          </p>
          <h1 className="text-white text-4xl font-bold leading-tight mb-3">ShopForge</h1>
          <p className="text-white/90 text-[15px] mb-7 max-w-xs leading-relaxed">
            Discover thousands of products at unbeatable prices
          </p>
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 bg-white font-semibold text-[14px] px-6 py-2.5 rounded-[4px] hover:bg-[#FFF3EC] transition-colors self-start"
            style={{ color: 'var(--color-primary)' }}
          >
            Shop Now <ChevronRight size={16} />
          </Link>
          <span
            className="absolute right-8 top-1/2 -translate-y-1/2 text-[110px] select-none pointer-events-none opacity-[0.15]"
            aria-hidden
          >
            🛍️
          </span>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="bg-white border border-[#E8E8E8] rounded-[4px] px-4 py-3 flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              <Icon size={17} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">{label}</p>
              <p className="text-[11px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Shop by category ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-gray-800">Shop by Category</h2>
          <Link href={ROUTES.PRODUCTS} className="text-[13px] text-[#F57224] hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {catLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="sf-shimmer h-24 rounded-[4px]" />
              ))
            : categories?.map((cat: Category) => (
                <Link
                  key={cat._id}
                  href={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
                  className="bg-white border border-[#E8E8E8] rounded-[4px] p-3 flex flex-col items-center gap-2 hover:border-[#F57224] hover:shadow-sm transition-all group text-center"
                >
                  <span className="text-3xl select-none" aria-hidden>
                    {CATEGORY_ICONS[cat.slug] ?? '🏷️'}
                  </span>
                  <span className="text-[12px] font-medium text-gray-700 group-hover:text-[#F57224] transition-colors leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
        </div>
      </section>

      {/* ── Popular Items ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[16px] font-bold text-gray-800">🔥 Popular Items</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Best-selling products across all categories</p>
          </div>
          <Link
            href={`${ROUTES.PRODUCTS}?sort=popular`}
            className="text-[13px] text-[#F57224] hover:underline"
          >
            View all →
          </Link>
        </div>
        <ProductGrid isLoading={popularLoading} products={popularData?.data} />
      </section>

      {/* ── Latest Arrivals ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[16px] font-bold text-gray-800">🆕 Latest Arrivals</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Freshly added to the store</p>
          </div>
          <Link
            href={`${ROUTES.PRODUCTS}?sort=newest`}
            className="text-[13px] text-[#F57224] hover:underline"
          >
            View all →
          </Link>
        </div>
        <ProductGrid isLoading={latestLoading} products={latestData?.data} />
      </section>

    </div>
  );
}
