'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChevronRight, CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';
import { useOrder } from '@/lib/hooks/use-orders';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { OrderStatus } from '@/types/order';

type TimelineStep = {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
};

const TIMELINE: TimelineStep[] = [
  { status: 'pending', label: 'Order placed', icon: Clock },
  { status: 'paid', label: 'Payment confirmed', icon: CheckCircle },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_ORDER: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-6">
        <div className="sf-shimmer h-8 w-48 rounded mb-4" />
        <div className="space-y-3">
          <div className="sf-shimmer h-24 rounded-[4px]" />
          <div className="sf-shimmer h-40 rounded-[4px]" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-[14px]">Order not found.</p>
        <Link href={ROUTES.ORDERS} className="mt-3 text-[13px] text-[#F57224] hover:underline block">
          Back to orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';
  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12px] mb-4">
        <Link href={ROUTES.ORDERS} className="text-[#0F3460] hover:underline">My Orders</Link>
        <ChevronRight size={12} className="text-gray-400" />
        <span className="text-gray-500 truncate max-w-[200px] font-mono">{order._id}</span>
      </nav>

      <div className="flex items-start justify-between gap-3 mb-4">
        <h1 className="text-[18px] font-bold text-gray-900">Order Details</h1>
        {isCancelled ? (
          <span className="flex items-center gap-1 text-[12px] font-semibold text-[#D0021B] bg-red-50 px-2 py-1 rounded-full">
            <XCircle size={13} />
            {STATUS_LABELS[order.status]}
          </span>
        ) : (
          <span className="text-[12px] font-semibold text-[#00B775] bg-green-50 px-2 py-1 rounded-full">
            {STATUS_LABELS[order.status]}
          </span>
        )}
      </div>

      {/* Status timeline */}
      {!isCancelled && (
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4 mb-4">
          <div className="flex items-start justify-between overflow-x-auto gap-0">
            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={step.status} className="flex flex-col items-center flex-1 min-w-0">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div className={`flex-1 h-0.5 ${i <= currentIdx ? 'bg-[#F57224]' : 'bg-[#E8E8E8]'}`} />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'bg-[#F57224] text-white' : 'bg-[#F5F5F5] text-gray-400'
                    } ${active ? 'ring-2 ring-[#F57224] ring-offset-1' : ''}`}>
                      <Icon size={14} />
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-[#F57224]' : 'bg-[#E8E8E8]'}`} />
                    )}
                  </div>
                  <p className={`mt-1.5 text-[10px] text-center ${done ? 'text-[#F57224] font-semibold' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Items */}
        <div className="md:col-span-2 space-y-2">
          <h2 className="text-[14px] font-bold">Items</h2>
          {order.items.map((item, i) => {
            const imgSrc = getImageUrl(item.imageUrl);
            return (
              <div key={i} className="bg-white border border-[#E8E8E8] rounded-[4px] p-3 flex gap-3 items-center">
                <div className="w-12 h-12 shrink-0 bg-[#F5F5F5] rounded-[4px] relative overflow-hidden">
                  {imgSrc ? (
                    <Image src={imgSrc} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 48 48" className="w-8 h-8">
                        <rect x="6" y="9" width="36" height="30" rx="2" fill="#E8E8E8" />
                        <circle cx="16" cy="19" r="3" fill="#CCC" />
                        <path d="M6 30 L18 21 L27 29 L33 24 L42 30 L42 39 L6 39 Z" fill="#CCC" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-[12px] text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-[13px] font-bold text-gray-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary + Address */}
        <div className="space-y-3">
          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-3">
            <h2 className="text-[13px] font-bold mb-2">Payment Summary</h2>
            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={order.shipping === 0 ? 'text-[#00B775]' : ''}>
                  {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[13px] border-t border-[#E8E8E8] pt-1.5">
                <span>Total</span>
                <span style={{ color: 'var(--color-price)' }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-3">
            <h2 className="text-[13px] font-bold mb-2">Shipping Address</h2>
            <address className="not-italic text-[12px] text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </div>

          {order.paymentReference && (
            <p className="text-[11px] text-gray-400 font-mono">Ref: {order.paymentReference}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link href={ROUTES.ORDERS} className="text-[13px] text-[#F57224] hover:underline">
          ← Back to orders
        </Link>
      </div>
    </div>
  );
}
