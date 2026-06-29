'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/hooks/use-cart';
import { useCreateOrder } from '@/lib/hooks/use-orders';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { Cart } from '@/lib/api/cart';

type Step = 'address' | 'payment' | 'confirmation';

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 499;

const STEP_LABELS: Record<Step, string> = {
  address: 'Shipping',
  payment: 'Payment',
  confirmation: 'Confirmation',
};
const STEPS: Step[] = ['address', 'payment', 'confirmation'];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: rawCart } = useCart();
  const cart = rawCart as Cart | undefined;
  const createOrder = useCreateOrder();

  const [step, setStep] = useState<Step>('address');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    country: 'GB',
  });

  const items = cart?.items ?? [];
  const subtotal = items.reduce((s, i) => s + i.priceAtAdd * i.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-[14px]">Your cart is empty.</p>
        <Link href={ROUTES.PRODUCTS} className="mt-3 text-[13px] text-[#F57224] hover:underline block">
          Browse products
        </Link>
      </div>
    );
  }

  async function handlePlaceOrder() {
    try {
      const order = await createOrder.mutateAsync({
        shippingAddress: {
          fullName: address.fullName,
          line1: address.line1,
          ...(address.line2 ? { line2: address.line2 } : {}),
          city: address.city,
          postcode: address.postcode,
          country: address.country,
        },
      });
      setOrderId(order._id);
      setStep('confirmation');
    } catch {
      /* error shown inline */
    }
  }

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4">
      {/* Stepper */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 text-[13px] font-medium ${
              i < stepIdx ? 'text-[#00B775]' : i === stepIdx ? 'text-[#F57224]' : 'text-gray-400'
            }`}>
              <span className={`w-6 h-6 rounded-full border-2 text-[11px] flex items-center justify-center font-bold ${
                i < stepIdx
                  ? 'bg-[#00B775] border-[#00B775] text-white'
                  : i === stepIdx
                  ? 'border-[#F57224] text-[#F57224]'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {i < stepIdx ? '✓' : i + 1}
              </span>
              {STEP_LABELS[s]}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Step content */}
        <div className="lg:col-span-2">

          {/* Step 1 — Address */}
          {step === 'address' && (
            <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-5">
              <h2 className="text-[15px] font-bold mb-4">Shipping Address</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Full name *</label>
                  <input
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                    className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Address line 1 *</label>
                  <input
                    required
                    value={address.line1}
                    onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                    className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Address line 2</label>
                  <input
                    value={address.line2}
                    onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
                    className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1">City *</label>
                    <input
                      required
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1">Postcode *</label>
                    <input
                      required
                      value={address.postcode}
                      onChange={(e) => setAddress((a) => ({ ...a, postcode: e.target.value }))}
                      className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                    className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224] bg-white"
                  >
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!address.fullName || !address.line1 || !address.city || !address.postcode) return;
                  setStep('payment');
                }}
                disabled={!address.fullName || !address.line1 || !address.city || !address.postcode}
                className="mt-5 px-6 py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors disabled:opacity-50"
                style={{ background: 'var(--color-primary)' }}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 'payment' && (
            <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-5">
              <h2 className="text-[15px] font-bold mb-1">Payment</h2>
              <p className="text-[12px] text-gray-500 mb-4">This is a demo store — no real payment is taken.</p>

              <div className="border border-[#E8E8E8] rounded-[4px] p-4 bg-[#FAFAFA] space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Card number</label>
                  <input
                    defaultValue="4111 1111 1111 1111"
                    readOnly
                    className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] bg-white text-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1">Expiry</label>
                    <input
                      defaultValue="12/28"
                      readOnly
                      className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] bg-white text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1">CVC</label>
                    <input
                      defaultValue="123"
                      readOnly
                      className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] bg-white text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {createOrder.error && (
                <p className="mt-3 text-[12px] text-[#D0021B] bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
                  {(createOrder.error as Error).message ?? 'Order failed. Please try again.'}
                </p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setStep('address')}
                  className="px-4 py-2.5 text-[14px] font-medium text-gray-600 border border-[#E8E8E8] rounded-[4px] hover:border-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={createOrder.isPending}
                  className="flex-1 py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors disabled:opacity-70"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {createOrder.isPending ? 'Placing order…' : `Place Order — ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirmation */}
          {step === 'confirmation' && (
            <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-8 text-center">
              <CheckCircle size={48} className="mx-auto mb-3" style={{ color: '#00B775' }} />
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Order placed!</h2>
              <p className="text-[13px] text-gray-500 mb-4">
                Your order has been confirmed. You&apos;ll receive a confirmation shortly.
              </p>
              {orderId && (
                <p className="text-[12px] text-gray-400 mb-5">Order ID: {orderId}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {orderId && (
                  <Link
                    href={ROUTES.ORDER(orderId)}
                    className="px-5 py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    View Order
                  </Link>
                )}
                <Link
                  href={ROUTES.PRODUCTS}
                  className="px-5 py-2.5 text-[14px] font-medium text-gray-700 border border-[#E8E8E8] rounded-[4px] hover:border-gray-400 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step !== 'confirmation' && (
          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4 h-fit">
            <h2 className="text-[14px] font-bold mb-3">
              Order Summary <span className="text-gray-400 font-normal">({items.length} items)</span>
            </h2>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {items.map((item) => {
                const p = item.product as { name: string } | null;
                return (
                  <div key={JSON.stringify(item)} className="flex justify-between text-[12px]">
                    <span className="text-gray-600 truncate flex-1 mr-2">{p?.name ?? 'Product'} ×{item.quantity}</span>
                    <span className="shrink-0 font-medium">{formatPrice(item.priceAtAdd * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#E8E8E8] pt-2 space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shippingFee === 0 ? 'text-[#00B775]' : ''}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[14px] border-t border-[#E8E8E8] pt-1.5">
                <span>Total</span>
                <span style={{ color: 'var(--color-price)' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
