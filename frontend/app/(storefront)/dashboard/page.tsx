'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, User, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
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

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || ordersLoading) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-10 space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-[4px] animate-pulse" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-[4px] animate-pulse" />
      </div>
    );
  }

  const orderList = (orders ?? []) as Order[];
  const totalSpent = orderList
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.total, 0);
  const delivered = orderList.filter((o) => o.status === 'delivered').length;
  const recent = orderList.slice(0, 5);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">My Dashboard</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Welcome back, {user?.name?.split(' ')[0]}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-[4px] flex items-center justify-center" style={{ background: '#F57224' + '15' }}>
              <Package size={16} style={{ color: '#F57224' }} />
            </div>
            <p className="text-[12px] text-gray-500">Total Orders</p>
          </div>
          <p className="text-[26px] font-bold text-gray-900">{orderList.length}</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-[4px] flex items-center justify-center" style={{ background: '#10B981' + '15' }}>
              <ShoppingCart size={16} style={{ color: '#10B981' }} />
            </div>
            <p className="text-[12px] text-gray-500">Total Spent</p>
          </div>
          <p className="text-[26px] font-bold text-gray-900">{formatPrice(totalSpent)}</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-[4px] flex items-center justify-center" style={{ background: '#6366F1' + '15' }}>
              <Package size={16} style={{ color: '#6366F1' }} />
            </div>
            <p className="text-[12px] text-gray-500">Delivered</p>
          </div>
          <p className="text-[26px] font-bold text-gray-900">{delivered}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="sm:col-span-2 bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-gray-900">Recent Orders</h2>
            <Link
              href={ROUTES.ORDERS}
              className="text-[12px] flex items-center gap-0.5 hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-8 text-center">
              <Package size={32} className="mx-auto text-gray-200 mb-2" />
              <p className="text-[13px] text-gray-400">No orders yet</p>
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-block mt-3 text-[12px] font-medium px-4 py-1.5 rounded-[4px] text-white"
                style={{ background: 'var(--color-primary)' }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((order) => {
                const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
                return (
                  <Link
                    key={order._id}
                    href={ROUTES.ORDER(order._id)}
                    className="flex items-center justify-between py-2.5 border-b border-[#F5F5F5] last:border-0 hover:opacity-70 transition-opacity"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-mono text-gray-500 truncate max-w-[180px]">{order._id}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                      <span className="text-[13px] font-bold text-gray-900">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
            <h2 className="text-[14px] font-bold text-gray-900 mb-3">Quick Links</h2>
            <div className="space-y-1">
              {[
                { href: ROUTES.PROFILE, label: 'Edit Profile', icon: User },
                { href: ROUTES.ORDERS, label: 'All Orders', icon: Package },
                { href: ROUTES.PRODUCTS, label: 'Browse Products', icon: ShoppingCart },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[4px] text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon size={14} className="text-gray-400" />
                  {label}
                  <ChevronRight size={12} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
            <h2 className="text-[13px] font-semibold text-gray-700 mb-2">Account</h2>
            <p className="text-[12px] text-gray-500 mb-0.5">{user?.name}</p>
            <p className="text-[12px] text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
