'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, ChevronDown, User } from 'lucide-react';
import { useCart } from '@/lib/hooks/use-cart';
import { useAuth } from '@/lib/hooks/use-auth';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Books', slug: 'books' },
  { name: 'Home & Garden', slug: 'home-garden' },
  { name: 'Sports', slug: 'sports' },
];

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: cart } = useCart();

  const cartCount =
    cart?.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0) ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      searchQuery.trim() ? `/products?search=${encodeURIComponent(searchQuery.trim())}` : '/products',
    );
  };

  return (
    <header className="sticky top-0 z-50" style={{ boxShadow: 'var(--shadow-navbar)' }}>
      {/* ── Utility bar ── */}
      <div className="hidden sm:block" style={{ background: '#1A1A1A' }}>
        <div className="max-w-[1200px] mx-auto px-4 h-9 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[12px] text-white/70">
            <span>Save More On App</span>
            <span className="text-white/30">·</span>
            <Link href="#" className="hover:text-white transition-colors">Sell on ShopForge</Link>
            <span className="text-white/30">·</span>
            <Link href="#" className="hover:text-white transition-colors">Help &amp; Support</Link>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-white/70">
            {isAuthenticated ? (
              <>
                <span className="text-white/50">Hi, {user?.name?.split(' ')[0] ?? 'User'}</span>
                <span className="text-white/30">·</span>
                <button
                  onClick={() => logout()}
                  className="hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
                <span className="text-white/30">·</span>
                <Link href="/auth/register" className="text-white font-medium hover:text-white/80 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-white font-bold text-xl tracking-tight select-none">ShopForge</span>
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[600px] mx-auto hidden sm:flex">
            <div className="flex w-full rounded-[4px] overflow-hidden bg-white h-10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in ShopForge"
                className="flex-1 px-4 text-[14px] text-gray-900 outline-none placeholder:text-gray-400 bg-transparent"
              />
              <button
                type="submit"
                aria-label="Search"
                className="px-4 border-l border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
                style={{ color: 'var(--color-primary)' }}
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0 shrink-0">
            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-1.5 text-white">
              <div className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5"
                    style={{ background: '#D0021B' }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[13px] font-medium">Cart</span>
            </Link>

            {/* Sign In — desktop */}
            {!isAuthenticated && (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-1 text-white text-[13px] font-medium"
              >
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Hamburger — mobile */}
            <button
              className="sm:hidden text-white p-1"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category nav — desktop only ── */}
      <div
        className="hidden sm:block bg-white"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 h-10 flex items-center gap-1">
          <div
            className="flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium text-white rounded-[2px] cursor-default select-none shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            <Menu size={13} />
            <span>All Categories</span>
            <ChevronDown size={13} />
          </div>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="px-3 py-2 text-[13px] text-gray-700 hover:text-[#F57224] whitespace-nowrap transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile search bar ── */}
      <div
        className="sm:hidden bg-white px-3 py-2"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <form onSubmit={handleSearch}>
          <div
            className="flex rounded-[4px] overflow-hidden border h-9"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 px-3 text-[13px] outline-none placeholder:text-gray-400 bg-transparent"
            />
            <button
              type="submit"
              aria-label="Search"
              className="px-3 border-l flex items-center"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
            >
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="px-4 py-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Categories
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center py-2.5 text-[14px] text-gray-700 border-b last:border-0"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {cat.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div
                className="flex gap-3 pt-3 mt-1 border-t"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 text-[13px] border rounded-[4px]"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 text-[13px] text-white rounded-[4px]"
                  style={{ background: 'var(--color-primary)' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
