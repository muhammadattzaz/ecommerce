import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/storefront/product-card';
import type { Product, Category } from '@/types/product';
import type { PaginatedResponse } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

async function fetchProducts(params: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products?${params}&limit=6`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: PaginatedResponse<Product> = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const CATEGORY_EMOJI: Record<string, string> = {
  electronics: '💻',
  clothing: '👔',
  books: '📚',
  'home-garden': '🏡',
  sports: '⚽',
};

export default async function HomePage() {
  const [flashDeals, justForYou, categories] = await Promise.all([
    fetchProducts('sort=price_asc'),
    fetchProducts('sort=createdAt_desc'),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      <Navbar />

      <main>
        {/* ── Hero banner ── */}
        <section className="bg-white mb-2">
          <div className="max-w-[1200px] mx-auto px-4 py-4">
            <div
              className="relative overflow-hidden rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #F57224 0%, #D45A0F 50%, #0F3460 100%)',
                minHeight: '220px',
              }}
            >
              <div className="absolute -right-8 -top-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute right-20 -bottom-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute right-6 top-6 w-24 h-24 rounded-full bg-orange-300/20 pointer-events-none" />

              <div className="relative z-10 px-8 py-10 sm:py-14 max-w-lg">
                <p className="text-orange-200 text-[11px] font-semibold uppercase tracking-[2px] mb-3">
                  Exclusive Online Deals
                </p>
                <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-3">
                  Shop Smarter,<br />
                  <span style={{ color: '#FFE066' }}>Save Bigger</span>
                </h1>
                <p className="text-white/75 text-[13px] mb-6">
                  Thousands of products from top brands.<br className="hidden sm:block" />
                  Free shipping on orders over £50.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href="/products"
                    className="inline-block bg-white text-[#F57224] font-semibold text-sm px-5 py-2.5 rounded-[4px] hover:bg-orange-50 transition-colors"
                  >
                    Shop Now →
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-block bg-white/10 text-white font-medium text-sm px-5 py-2.5 rounded-[4px] border border-white/25 hover:bg-white/20 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>

              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden sm:flex">
                <div
                  className="text-white text-center px-5 py-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <p className="text-4xl font-black" style={{ color: '#FFE066' }}>70%</p>
                  <p className="text-sm font-semibold">OFF</p>
                  <p className="text-[11px] text-white/70 mt-0.5">Selected Items</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Flash Deals ── */}
        <section className="bg-white mb-2 py-5">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-bold" style={{ color: 'var(--color-primary)' }}>
                  🔥 Flash Deals
                </h2>
                <span
                  className="text-[13px] font-medium pb-0.5 border-b-2"
                  style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
                >
                  On Sale Now
                </span>
              </div>
              <Link
                href="/products"
                className="text-[13px] font-medium border px-4 py-1.5 rounded-[2px] hover:bg-[#FFF3EC] transition-colors hidden sm:block"
                style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
              >
                SHOP ALL PRODUCTS →
              </Link>
            </div>

            {flashDeals.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {flashDeals.map((product) => (
                  <ProductCard
                    key={product._id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-[4px] animate-pulse" />
                ))}
              </div>
            )}

            <div className="sm:hidden mt-3 text-center">
              <Link href="/products" className="text-[13px] font-medium" style={{ color: 'var(--color-primary)' }}>
                See all deals →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Shop by Category ── */}
        {categories.length > 0 && (
          <section className="bg-white mb-2 py-5">
            <div className="max-w-[1200px] mx-auto px-4">
              <h2 className="text-[20px] font-bold text-gray-900 mb-4">Categories</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat.slug}`}
                    className="flex flex-col items-center justify-center border rounded-[4px] py-4 px-2 hover:shadow-md transition-all group"
                    style={{ borderColor: 'var(--color-border)', background: 'white' }}
                  >
                    <span className="text-[36px] mb-2 leading-none">
                      {CATEGORY_EMOJI[cat.slug] ?? '🛍️'}
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-medium text-center text-gray-700 group-hover:text-[#F57224] transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Just For You ── */}
        <section className="bg-white mb-2 py-5">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[20px] font-bold text-gray-900">Just For You</h2>
                <p className="text-[12px] text-gray-500 mt-0.5">Popular picks across all categories</p>
              </div>
              <Link href="/products" className="text-[13px]" style={{ color: 'var(--color-primary)' }}>
                View All →
              </Link>
            </div>

            {justForYou.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {justForYou.map((product) => (
                  <ProductCard
                    key={product._id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-[4px] animate-pulse" />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Sign-up nudge ── */}
        <section className="mb-2 py-8" style={{ background: 'var(--color-primary-light)' }}>
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-[18px] font-bold text-gray-900 mb-1">
              Get personalised recommendations
            </h2>
            <p className="text-[13px] text-gray-600 mb-4">
              Create a free account to see products tailored to your interests and purchase history.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/auth/register"
                className="px-6 py-2.5 text-[14px] font-semibold text-white rounded-[4px]"
                style={{ background: 'var(--color-primary)' }}
              >
                Sign Up Free
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-2.5 text-[14px] font-medium text-gray-700 bg-white border rounded-[4px]"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trust badges ── */}
        <section className="bg-white py-6 mb-2">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: '🚚', title: 'Free Shipping', desc: 'On all orders over £50' },
                { emoji: '🔒', title: 'Secure Payment', desc: '100% secure transactions' },
                { emoji: '↩', title: '30-Day Returns', desc: 'Hassle-free return policy' },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="flex items-center gap-4 p-4 border rounded-[4px]"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span className="text-[28px] shrink-0">{badge.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[14px]">{badge.title}</h3>
                    <p className="text-[12px] text-gray-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
