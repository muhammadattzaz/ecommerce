import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product', 'name slug price stock imageUrl isActive');

    if (!cart) {
      return this.cartModel.create({ user: userId, items: [] }) as unknown as CartDocument;
    }
    return cart;
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<CartDocument> {
    const product = await this.productsService.findById(dto.productId);
    if (!product.isActive) throw new BadRequestException('Product is not available');
    if (product.stock < dto.quantity) throw new BadRequestException('Insufficient stock');

    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      await this.cartModel.create({
        user: userId,
        items: [{ product: dto.productId, quantity: dto.quantity, priceAtAdd: product.price }],
      });
    } else {
      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === dto.productId,
      );

      if (existingIndex >= 0) {
        const newQty = cart.items[existingIndex].quantity + dto.quantity;
        if (product.stock < newQty) throw new BadRequestException('Insufficient stock');
        cart.items[existingIndex].quantity = newQty;
      } else {
        cart.items.push({ product: dto.productId as unknown as typeof cart.items[0]['product'], quantity: dto.quantity, priceAtAdd: product.price });
      }
      await cart.save();
    }

    return this.getCart(userId);
  }

  async updateItem(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex < 0) throw new NotFoundException('Item not in cart');

    if (dto.quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await this.productsService.findById(productId);
      if (product.stock < dto.quantity) throw new BadRequestException('Insufficient stock');
      cart.items[itemIndex].quantity = dto.quantity;
    }

    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { upsert: true },
    );
  }
}
