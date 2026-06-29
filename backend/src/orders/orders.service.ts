import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { MockPaymentService } from './payment/mock-payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const SHIPPING_THRESHOLD_PENCE = 5000; // free shipping over £50
const SHIPPING_FEE_PENCE = 499; // £4.99 flat shipping

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private readonly paymentService: MockPaymentService,
  ) {}

  async createFromCart(userId: string, dto: CreateOrderDto): Promise<OrderDocument> {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) throw new BadRequestException('Cart is empty');

    // Decrement stock atomically; roll back on any failure
    const decremented: { productId: string; qty: number }[] = [];
    try {
      for (const item of cart.items) {
        const productId = (item.product as unknown as { _id: { toString(): string } })._id.toString();
        const updated = await this.productsService.decrementStock(productId, item.quantity);
        if (!updated) {
          throw new BadRequestException(
            `Insufficient stock for product ${productId}`,
          );
        }
        decremented.push({ productId, qty: item.quantity });
      }
    } catch (err) {
      // Roll back any decrements already applied
      for (const { productId, qty } of decremented) {
        await this.productsService.decrementStock(productId, -qty).catch(() => null);
      }
      throw err;
    }

    // Build order items with price snapshot
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderItems: any[] = cart.items.map((item) => {
      const prod = item.product as unknown as {
        _id: unknown;
        name: string;
        price: number;
        imageUrl: string | null;
      };
      return {
        productId: prod._id,
        name: prod.name,
        price: item.priceAtAdd, // price snapshot from when item was added to cart
        quantity: item.quantity,
        imageUrl: prod.imageUrl ?? null,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= SHIPPING_THRESHOLD_PENCE ? 0 : SHIPPING_FEE_PENCE;
    const total = subtotal + shipping;

    // Process payment
    const payment = await this.paymentService.charge(total);
    if (!payment.success) throw new BadRequestException('Payment failed');

    const order = await this.orderModel.create({
      user: userId,
      items: orderItems,
      subtotal,
      shipping,
      total,
      shippingAddress: dto.shippingAddress,
      status: 'paid',
      paymentReference: payment.reference,
    });

    // Clear the cart
    await this.cartService.clearCart(userId);

    return order;
  }

  async findByUser(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findOneByUser(orderId: string, userId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.user.toString() !== userId) throw new ForbiddenException('Access denied');
    return order;
  }

  // Admin methods
  async findAll(page = 1, limit = 20, status?: string): Promise<{
    data: OrderDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.orderModel.countDocuments(filter),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: dto.status as OrderStatus },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
