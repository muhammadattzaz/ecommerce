'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, Zap, ChevronRight } from 'lucide-react';
import { useProduct } from '@/lib/hooks/use-products';
import { useAddToCart } from '@/lib/hooks/use-cart';
import { useCartStore } from '@/lib/stores/cart.store';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { Category } from '@/types/product';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, error } = useProduct(slug);
  const addToCart = useAddToCart();
  const setCartOpen = useCartStore((s) => s.setOpen);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="sf-shimmer aspect-square rounded-[4px]" />
          <div className="space-y-4">
            <div className="sf-shimmer h-8 w-3/4 rounded" />
            <div className="sf-shimmer h-6 w-1/2 rounded" />
            <div className="sf-shimmer h-20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-[14px]">Product not found.</p>
        <Link href={ROUTES.PRODUCTS} className="mt-3 text-[13px] text-[#F57224] hover:underline block">
          Browse all products
        </Link>
      </div>
    );
  }

  const category = product.category as Category;
  const imgSrc = getImageUrl(product.imageUrl);
  const stars = Math.round(product.rating);
  const inStock = product.stock > 0;

  async function handleAddToCart() {
    if (!inStock) return;
    await addToCart.mutateAsync({ productId: product!._id, quantity: qty });
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12px] mb-4">
        <Link href={ROUTES.HOME} className="text-[#0F3460] hover:underline">Home</Link>
        <ChevronRight size={12} className="text-gray-400" />
        <Link href={ROUTES.PRODUCTS} className="text-[#0F3460] hover:underline">Products</Link>
        {category && typeof category === 'object' && (
          <>
            <ChevronRight size={12} className="text-gray-400" />
            <Link
              href={`${ROUTES.PRODUCTS}?category=${category.slug}`}
              className="text-[#0F3460] hover:underline"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} className="text-gray-400" />
        <span className="text-gray-500 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#E8E8E8] rounded-[4px] p-5">
        {/* Image */}
        <div className="relative aspect-square bg-[#F5F5F5] rounded-[4px] overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-24 h-24">
                <rect x="20" y="30" width="120" height="100" rx="6" fill="#E8E8E8" />
                <circle cx="54" cy="62" r="10" fill="#CCCCCC" />
                <path d="M20 100 L60 70 L90 96 L110 80 L140 100 L140 130 L20 130 Z" fill="#CCCCCC" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= stars ? '#FFBB00' : 'none'}
                    stroke={s <= stars ? '#FFBB00' : '#CCCCCC'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-[13px] text-gray-500">
                {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold" style={{ color: 'var(--color-price)' }}>
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Stock */}
          <p className={`text-[13px] font-medium ${inStock ? 'text-[#00B775]' : 'text-[#D0021B]'}`}>
            {inStock ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-[13px] text-gray-600 leading-relaxed border-t border-[#F5F5F5] pt-3">
              {product.description}
            </p>
          )}

          {/* Quantity */}
          {inStock && (
            <div className="flex items-center gap-3 border-t border-[#F5F5F5] pt-3">
              <span className="text-[13px] text-gray-600">Qty:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 border border-[#E8E8E8] rounded-[4px] text-gray-600 hover:border-[#F57224] hover:text-[#F57224] transition-colors flex items-center justify-center text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-[14px] font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-7 h-7 border border-[#E8E8E8] rounded-[4px] text-gray-600 hover:border-[#F57224] hover:text-[#F57224] transition-colors flex items-center justify-center text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2 border-t border-[#F5F5F5] pt-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || addToCart.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: added ? '#00B775' : 'var(--color-primary)' }}
            >
              <ShoppingCart size={16} />
              {added ? 'Added to cart!' : addToCart.isPending ? 'Adding…' : 'Add to Cart'}
            </button>
            <Link
              href={ROUTES.CHECKOUT}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors"
              style={{ background: 'var(--color-action-blue)' }}
            >
              <Zap size={16} />
              Buy Now
            </Link>
          </div>

          {/* Shipping info */}
          <div className="border border-[#E8E8E8] rounded-[4px] p-3 text-[12px] text-gray-600 space-y-1.5 bg-[#FAFAFA]">
            <p>🚚 <span className="font-medium">Free shipping</span> on orders over £50</p>
            <p>↩ <span className="font-medium">30-day returns</span> — hassle-free</p>
            <p>🔒 <span className="font-medium">Secure checkout</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
