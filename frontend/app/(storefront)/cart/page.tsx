'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/lib/hooks/use-cart';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { CartItem, Cart } from '@/lib/api/cart';

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 499;

export default function CartPage() {
  const { data, isLoading } = useCart();
  const cart = data as Cart | undefined;
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <h1 className="text-[20px] font-bold mb-4">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {[1, 2].map((i) => <div key={i} className="sf-shimmer h-28 rounded-[4px]" />)}
          </div>
          <div className="sf-shimmer h-48 rounded-[4px]" />
        </div>
      </div>
    );
  }

  const items: CartItem[] = cart?.items ?? [];
  type PopulatedProduct = { _id: string; name: string; imageUrl?: string; slug: string; stock: number };

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-[20px] font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-[13px] text-gray-500 mb-6">Add some products to get started</p>
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-block px-6 py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors"
          style={{ background: 'var(--color-primary)' }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4">
      <h1 className="text-[20px] font-bold mb-4">
        Shopping Cart <span className="text-[14px] font-normal text-gray-500">({items.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Items */}
        <div className="lg:col-span-2 space-y-2">
          {items.map((item, idx) => {
            const product = item.product as PopulatedProduct | null;
            const productId = product?._id ?? String(idx);
            const imgSrc = getImageUrl(product?.imageUrl);

            return (
              <div
                key={productId || idx}
                className="bg-white border border-[#E8E8E8] rounded-[4px] p-3 flex gap-3 items-start"
              >
                {/* Image */}
                <div className="w-16 h-16 shrink-0 bg-[#F5F5F5] rounded-[4px] overflow-hidden relative">
                  {imgSrc ? (
                    <Image src={imgSrc} alt={product?.name ?? ''} fill className="object-contain p-1" sizes="64px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 64 64" className="w-10 h-10">
                        <rect x="8" y="12" width="48" height="40" rx="3" fill="#E8E8E8" />
                        <circle cx="22" cy="25" r="4" fill="#CCC" />
                        <path d="M8 40 L24 28 L36 38 L44 32 L56 40 L56 52 L8 52 Z" fill="#CCC" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-800 truncate">
                    {product?.name ?? 'Product'}
                  </p>
                  <p className="text-[13px] font-bold mt-0.5" style={{ color: 'var(--color-price)' }}>
                    {formatPrice(item.priceAtAdd)}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) {
                          removeItem.mutate(productId);
                        } else {
                          updateItem.mutate({ productId, quantity: item.quantity - 1 });
                        }
                      }}
                      className="w-6 h-6 border border-[#E8E8E8] rounded text-gray-600 hover:border-[#F57224] text-sm flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-[13px] font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateItem.mutate({ productId, quantity: item.quantity + 1 })}
                      disabled={product ? item.quantity >= product.stock : false}
                      className="w-6 h-6 border border-[#E8E8E8] rounded text-gray-600 hover:border-[#F57224] text-sm flex items-center justify-center disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line total + remove */}
                <div className="shrink-0 text-right flex flex-col items-end gap-2">
                  <p className="text-[14px] font-bold text-gray-900">
                    {formatPrice(item.priceAtAdd * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem.mutate(productId)}
                    className="text-gray-400 hover:text-[#D0021B] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4 h-fit sticky top-4">
          <h2 className="text-[15px] font-bold mb-3">Order Summary</h2>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({items.length} items)</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className={shippingFee === 0 ? 'text-[#00B775] font-medium' : 'font-medium'}>
                {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
              </span>
            </div>
            {shippingFee > 0 && (
              <p className="text-[11px] text-gray-400">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
              </p>
            )}
            <div className="border-t border-[#E8E8E8] pt-2 flex justify-between text-[15px] font-bold">
              <span>Total</span>
              <span style={{ color: 'var(--color-price)' }}>{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href={ROUTES.CHECKOUT}
            className="mt-4 block w-full text-center py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors"
            style={{ background: 'var(--color-primary)' }}
          >
            Proceed to Checkout
          </Link>

          <Link
            href={ROUTES.PRODUCTS}
            className="mt-2 block w-full text-center py-2 text-[13px] text-[#F57224] hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
