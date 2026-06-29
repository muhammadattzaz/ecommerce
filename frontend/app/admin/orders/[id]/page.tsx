'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useAdminOrder, useUpdateOrderStatus } from '@/lib/hooks/use-orders';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { OrderStatus } from '@/types/order';

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: ['refunded'],
  refunded: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending', paid: 'Paid', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="sf-shimmer h-8 w-48 rounded" />
        <div className="sf-shimmer h-40 rounded-[4px]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-[14px]">Order not found.</p>
        <Link href={ROUTES.ADMIN.ORDERS} className="mt-2 text-[13px] text-[#F57224] hover:underline block">
          Back to orders
        </Link>
      </div>
    );
  }

  const nextStatuses = TRANSITIONS[order.status] ?? [];

  async function handleUpdateStatus() {
    if (!selectedStatus) return;
    await updateStatus.mutateAsync({ id, status: selectedStatus });
    setSelectedStatus('');
  }

  return (
    <div className="max-w-[800px]">
      <nav className="flex items-center gap-1 text-[12px] mb-4">
        <Link href={ROUTES.ADMIN.ORDERS} className="text-[#F57224] hover:underline">Orders</Link>
        <ChevronRight size={12} className="text-gray-400" />
        <span className="text-gray-500 font-mono truncate max-w-[200px]">{order._id}</span>
      </nav>

      <div className="flex items-start justify-between gap-3 mb-4">
        <h1 className="text-[18px] font-bold text-gray-900">Order Detail</h1>
        <span className="text-[12px] font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded capitalize">
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Status updater */}
      {nextStatuses.length > 0 && (
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4 mb-4 flex items-center gap-3 flex-wrap">
          <span className="text-[13px] font-medium text-gray-700">Update status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="h-8 px-2 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224] bg-white"
          >
            <option value="">Select…</option>
            {nextStatuses.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <button
            onClick={handleUpdateStatus}
            disabled={!selectedStatus || updateStatus.isPending}
            className="px-4 py-1.5 text-[13px] font-semibold text-white rounded-[4px] disabled:opacity-50"
            style={{ background: 'var(--color-primary)' }}
          >
            {updateStatus.isPending ? 'Updating…' : 'Update'}
          </button>
          {updateStatus.isSuccess && (
            <span className="text-[12px] text-[#00B775]">Updated</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Items */}
        <div className="md:col-span-2 space-y-2">
          <h2 className="text-[14px] font-bold text-gray-900">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="bg-white border border-[#E8E8E8] rounded-[4px] p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-[12px] text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <p className="text-[13px] font-bold text-gray-900 shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-3">
            <h2 className="text-[13px] font-bold mb-2">Payment</h2>
            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-[13px] border-t border-[#E8E8E8] pt-1.5">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
            {order.paymentReference && (
              <p className="mt-2 text-[11px] text-gray-400 font-mono">Ref: {order.paymentReference}</p>
            )}
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

          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-3">
            <h2 className="text-[13px] font-bold mb-1">Placed</h2>
            <p className="text-[12px] text-gray-600">
              {new Date(order.createdAt).toLocaleString('en-GB')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
