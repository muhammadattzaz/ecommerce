import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';
import { Document } from 'mongoose';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<User & Document>,
  ) {}

  async getDashboard() {
    const [totalOrders, totalProducts, totalUsers, revenueAgg, recentOrders, topProducts] =
      await Promise.all([
        this.orderModel.countDocuments(),
        this.productModel.countDocuments({ isActive: true }),
        this.userModel.countDocuments({ role: 'customer' }),
        this.orderModel.aggregate([
          { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        this.orderModel
          .find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(5),
        this.orderModel.aggregate([
          { $unwind: '$items' },
          { $group: { _id: '$items.productId', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },
        ]),
      ]);

    // Revenue by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueByDay = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Order status breakdown
    const statusBreakdown = await this.orderModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return {
      kpis: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue: revenueAgg[0]?.total ?? 0,
      },
      recentOrders,
      topProducts,
      revenueByDay,
      statusBreakdown,
    };
  }
}
