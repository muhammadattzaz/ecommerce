'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAllOrders } from '@/lib/hooks/use-orders';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { Order, OrderStatus } from '@/types/order';

const STATUSES: Array<{ value: string; label: string }> = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  paid: { bg: 'bg-blue-50', text: 'text-blue-700' },
  processing: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-700' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700' },
  refunded: { bg: 'bg-gray-50', text: 'text-gray-600' },
};

export default function AdminOrdersPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAllOrders({ page, limit: 20, status: status || undefined });
  const orders = (data?.data ?? []) as Order[];

  return (
    <div>
      <h1 className="text-[20px] font-bold text-gray-900 mb-4">Orders</h1>

      {/* Status filter */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(1); }}
            className={`shrink-0 text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
              status === s.value
                ? 'bg-[#F57224] text-white border-[#F57224]'
                : 'bg-white text-gray-600 border-[#E8E8E8] hover:border-[#F57224]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E8E8E8] rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Order ID</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Total</th>
                <th className="text-center px-4 py-2.5 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F5F5]">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="sf-shimmer h-4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const sc = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
                  return (
                    <tr key={order._id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-4 py-2.5 font-mono text-gray-700 text-[12px] truncate max-w-[140px]">
                        {order._id}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${sc.bg} ${sc.text}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link
                          href={ROUTES.ADMIN.ORDER(order._id)}
                          className="text-[12px] text-[#F57224] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E8E8]">
            <p className="text-[12px] text-gray-500">
              {data.total} orders · Page {page} of {data.totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-[12px] px-3 py-1 text-[#F57224] disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-[12px] px-3 py-1 text-[#F57224] disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
