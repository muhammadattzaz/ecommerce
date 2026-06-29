'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { useMyOrders } from '@/lib/hooks/use-orders';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { Order, OrderStatus } from '@/types/order';

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
  paid: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Paid' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Processing' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Shipped' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', label: 'Delivered' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Cancelled' },
  refunded: { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Refunded' },
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-6">
        <h1 className="text-[20px] font-bold mb-4">My Orders</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="sf-shimmer h-20 rounded-[4px]" />)}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-[20px] font-bold text-gray-800 mb-2">No orders yet</h1>
        <p className="text-[13px] text-gray-500 mb-6">Your order history will appear here.</p>
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-block px-6 py-2.5 text-[14px] font-semibold text-white rounded-[4px] transition-colors"
          style={{ background: 'var(--color-primary)' }}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-4">
      <h1 className="text-[20px] font-bold mb-4">My Orders</h1>
      <div className="space-y-2">
        {(orders as Order[]).map((order) => {
          const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
          return (
            <Link
              key={order._id}
              href={ROUTES.ORDER(order._id)}
              className="block bg-white border border-[#E8E8E8] rounded-[4px] p-4 hover:border-[#F57224] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-gray-400 font-mono">{order._id}</p>
                  <p className="text-[13px] text-gray-600 mt-0.5">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                  <p className="text-[13px] font-bold mt-1 text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
