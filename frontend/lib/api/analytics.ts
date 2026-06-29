import { apiClient } from './client';

export interface DashboardData {
  kpis: {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalRevenue: number;
  };
  recentOrders: unknown[];
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  revenueByDay: Array<{ _id: string; revenue: number; orders: number }>;
  statusBreakdown: Array<{ _id: string; count: number }>;
}

export const analyticsApi = {
  getDashboard: () => apiClient.get<DashboardData>('/analytics/dashboard'),
};
