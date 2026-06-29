'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/storefront/product-card';
import { useProducts, useCategories } from '@/lib/hooks/use-products';
import { ROUTES } from '@/lib/routes';
import type { Product } from '@/types/product';
import type { Category } from '@/types/product';

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get('search') ?? '';
  const categorySlug = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');

  const { data: categories } = useCategories();
  const activeCategoryId = categories?.find((c: Category) => c.slug === categorySlug)?._id;

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: activeCategoryId,
    sort: sort || undefined,
    page,
    limit: 20,
  });

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    router.push(`${ROUTES.PRODUCTS}?${params.toString()}`);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4">
      <div className="flex gap-4">

        {/* ── Sidebar filters ── */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
            <h3 className="text-[13px] font-bold text-gray-800 mb-3">Categories</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setParam('category', '')}
                  className={`w-full text-left text-[13px] px-2 py-1.5 rounded-[2px] transition-colors ${
                    !categorySlug
                      ? 'text-[#F57224] font-semibold bg-[#FFF3EC]'
                      : 'text-gray-600 hover:text-[#F57224]'
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories?.map((cat: Category) => (
                <li key={cat._id}>
                  <button
                    onClick={() => setParam('category', cat.slug)}
                    className={`w-full text-left text-[13px] px-2 py-1.5 rounded-[2px] transition-colors ${
                      categorySlug === cat.slug
                        ? 'text-[#F57224] font-semibold bg-[#FFF3EC]'
                        : 'text-gray-600 hover:text-[#F57224]'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white border border-[#E8E8E8] rounded-[4px] px-4 py-2.5 mb-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[13px] text-gray-500">
              {isLoading ? 'Loading…' : `${data?.total ?? 0} products`}
              {search && <span className="ml-1 font-medium text-gray-700">for &quot;{search}&quot;</span>}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-500 hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="text-[13px] border border-[#E8E8E8] rounded-[4px] px-2 py-1 outline-none focus:border-[#F57224]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-3">
            {[{ name: 'All', slug: '' }, ...(categories ?? [])].map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setParam('category', cat.slug)}
                className={`shrink-0 text-[12px] px-3 py-1 rounded-full border transition-colors ${
                  categorySlug === cat.slug || (!categorySlug && !cat.slug)
                    ? 'bg-[#F57224] text-white border-[#F57224]'
                    : 'bg-white text-gray-600 border-[#E8E8E8]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sf-shimmer aspect-[3/4] rounded-[4px]" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="bg-white border border-[#E8E8E8] rounded-[4px] py-16 text-center">
              <p className="text-gray-500 text-[14px]">No products found.</p>
              <button
                onClick={() => router.push(ROUTES.PRODUCTS)}
                className="mt-3 text-[13px] text-[#F57224] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {data?.data.map((p: Product) => (
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
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setParam('page', String(page - 1))}
                className="text-[13px] px-3 py-1.5 text-[#F57224] disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setParam('page', String(p))}
                  className={`w-8 h-8 text-[13px] rounded-full border transition-colors ${
                    p === page
                      ? 'bg-[#F57224] text-white border-[#F57224]'
                      : 'bg-white text-gray-700 border-[#E8E8E8] hover:border-[#F57224]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= data.totalPages}
                onClick={() => setParam('page', String(page + 1))}
                className="text-[13px] px-3 py-1.5 text-[#F57224] disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
