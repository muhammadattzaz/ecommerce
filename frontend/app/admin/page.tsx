'use client';

import Link from 'next/link';
import { ShoppingBag, Package, Users, TrendingUp } from 'lucide-react';
import { useDashboard } from '@/lib/hooks/use-analytics';
import { useAllOrders } from '@/lib/hooks/use-orders';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { DashboardData } from '@/lib/api/analytics';
import type { Order, OrderStatus } from '@/types/order';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#F59E0B',
  paid: '#3B82F6',
  processing: '#6366F1',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
  refunded: '#9CA3AF',
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard();
  const { data: recentOrdersData } = useAllOrders({ limit: 5 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-[20px] font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="sf-shimmer h-24 rounded-[4px]" />)}
        </div>
        <div className="sf-shimmer h-64 rounded-[4px]" />
      </div>
    );
  }

  const dashboard = data as DashboardData | undefined;
  const kpis = dashboard?.kpis;
  const recentOrders = (recentOrdersData?.data ?? []) as Order[];

  const KPI_CARDS = [
    {
      label: 'Total Revenue',
      value: kpis ? formatPrice(kpis.totalRevenue) : '—',
      icon: TrendingUp,
      color: '#F57224',
    },
    {
      label: 'Total Orders',
      value: kpis?.totalOrders.toLocaleString() ?? '—',
      icon: ShoppingBag,
      color: '#0F3460',
    },
    {
      label: 'Products',
      value: kpis?.totalProducts.toLocaleString() ?? '—',
      icon: Package,
      color: '#6366F1',
    },
    {
      label: 'Customers',
      value: kpis?.totalUsers.toLocaleString() ?? '—',
      icon: Users,
      color: '#10B981',
    },
  ];

  const maxRevenue = Math.max(...(dashboard?.revenueByDay?.map((d) => d.revenue) ?? [1]));

  return (
    <div className="space-y-5">
      <h1 className="text-[20px] font-bold text-gray-900">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPI_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[12px] text-gray-500">{label}</p>
              <div className="w-8 h-8 rounded-[4px] flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-[22px] font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <h2 className="text-[14px] font-bold mb-3 text-gray-900">Revenue — Last 30 Days</h2>
          {dashboard?.revenueByDay && dashboard.revenueByDay.length > 0 ? (
            <div className="flex items-end gap-1 h-32">
              {dashboard.revenueByDay.map((d) => (
                <div key={d._id} className="flex-1 flex flex-col items-center gap-0.5 group">
                  <div
                    className="w-full rounded-sm transition-opacity group-hover:opacity-70"
                    style={{
                      height: `${Math.max(4, (d.revenue / maxRevenue) * 112)}px`,
                      background: 'var(--color-primary)',
                      opacity: 0.8,
                    }}
                    title={`${d._id}: ${formatPrice(d.revenue)}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-[13px] text-gray-400">
              No revenue data yet
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <h2 className="text-[14px] font-bold mb-3 text-gray-900">Order Status</h2>
          {dashboard?.statusBreakdown && dashboard.statusBreakdown.length > 0 ? (
            <div className="space-y-2">
              {dashboard.statusBreakdown.map((s) => {
                const color = STATUS_COLORS[s._id as OrderStatus] ?? '#9CA3AF';
                return (
                  <div key={s._id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-[12px] text-gray-600 capitalize flex-1">{s._id}</span>
                    <span className="text-[12px] font-bold text-gray-900">{s.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400">No data yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-gray-900">Recent Orders</h2>
            <Link href={ROUTES.ADMIN.ORDERS} className="text-[12px] text-[#F57224] hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  href={ROUTES.ADMIN.ORDER(order._id)}
                  className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0 hover:opacity-70 transition-opacity"
                >
                  <div>
                    <p className="text-[12px] font-medium text-gray-800 font-mono truncate max-w-[160px]">{order._id}</p>
                    <p className="text-[11px] text-gray-400 capitalize">{order.status}</p>
                  </div>
                  <p className="text-[13px] font-bold text-gray-900">{formatPrice(order.total)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400">No orders yet</p>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-gray-900">Top Products</h2>
            <Link href={ROUTES.ADMIN.PRODUCTS} className="text-[12px] text-[#F57224] hover:underline">
              View all
            </Link>
          </div>
          {dashboard?.topProducts && dashboard.topProducts.length > 0 ? (
            <div className="space-y-2">
              {dashboard.topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-2 py-2 border-b border-[#F5F5F5] last:border-0">
                  <span className="text-[11px] font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400">{p.totalSold} sold</p>
                  </div>
                  <p className="text-[13px] font-bold text-gray-900 shrink-0">{formatPrice(p.revenue)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400">No sales data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
