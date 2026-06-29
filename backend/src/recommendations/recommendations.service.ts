import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async getForUser(userId: string, limit = 8): Promise<ProductDocument[]> {
    // Find categories the user has purchased from
    const userOrders = await this.orderModel.find({ user: userId }).limit(20);

    if (!userOrders.length) {
      // No purchase history — return newest active products
      return this.productModel
        .find({ isActive: true })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    // Tally category affinity from order items
    const categoryCount = new Map<string, number>();
    for (const order of userOrders) {
      for (const item of order.items) {
        const id = item.productId?.toString();
        if (id) {
          categoryCount.set(id, (categoryCount.get(id) ?? 0) + item.quantity);
        }
      }
    }

    // Get product IDs the user already bought
    const boughtProductIds = [...categoryCount.keys()];

    // Find those products to get their categories
    const boughtProducts = await this.productModel
      .find({ _id: { $in: boughtProductIds } })
      .select('category');

    const affinityCategories = [...new Set(boughtProducts.map((p) => p.category.toString()))];

    // Return products from those categories that the user hasn't bought
    const recommendations = await this.productModel
      .find({
        category: { $in: affinityCategories },
        _id: { $nin: boughtProductIds },
        isActive: true,
      })
      .populate('category', 'name slug')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit);

    if (recommendations.length < limit) {
      // Pad with newest products
      const existing = recommendations.map((p) => (p._id as unknown as { toString(): string }).toString());
      const padding = await this.productModel
        .find({ _id: { $nin: [...boughtProductIds, ...existing] }, isActive: true })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit - recommendations.length);
      recommendations.push(...padding);
    }

    return recommendations;
  }

  async getFeatured(limit = 8): Promise<ProductDocument[]> {
    return this.productModel
      .find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
      .limit(limit);
  }
}
