import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { MockPaymentService } from './payment/mock-payment.service';

const mockAddress = {
  fullName: 'Jane Doe',
  line1: '1 Main St',
  city: 'London',
  postcode: 'SW1A 1AA',
  country: 'GB',
};

const makeProduct = (id: string, price: number, stock = 10) => ({
  _id: { toString: () => id },
  name: `Product ${id}`,
  price,
  imageUrl: null,
  stock,
});

const makeCartItem = (productId: string, price: number, quantity: number, stock = 10) => ({
  product: makeProduct(productId, price, stock),
  priceAtAdd: price,
  quantity,
});

const mockCartService = { getCart: jest.fn(), clearCart: jest.fn() };
const mockProductsService = { decrementStock: jest.fn() };
const mockPaymentService = { charge: jest.fn() };
const mockOrderModel = { create: jest.fn() };

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getModelToken(Order.name), useValue: mockOrderModel },
        { provide: CartService, useValue: mockCartService },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: MockPaymentService, useValue: mockPaymentService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('createFromCart — stock guard', () => {
    it('throws BadRequestException when a product has insufficient stock', async () => {
      mockCartService.getCart.mockResolvedValue({
        items: [makeCartItem('p1', 1000, 5, 3)], // wants 5, only 3 in stock
      });
      // decrementStock returns null = insufficient stock
      mockProductsService.decrementStock.mockResolvedValue(null);

      await expect(
        service.createFromCart('user-1', { shippingAddress: mockAddress }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rolls back stock decrements if a later item fails', async () => {
      mockCartService.getCart.mockResolvedValue({
        items: [makeCartItem('p1', 1000, 2), makeCartItem('p2', 500, 3)],
      });
      // p1 succeeds, p2 fails
      mockProductsService.decrementStock
        .mockResolvedValueOnce(makeProduct('p1', 1000))
        .mockResolvedValueOnce(null);

      await expect(
        service.createFromCart('user-1', { shippingAddress: mockAddress }),
      ).rejects.toThrow(BadRequestException);

      // Rollback: called 3 times total (1 decrement p1, 1 fail p2, 1 rollback p1)
      expect(mockProductsService.decrementStock).toHaveBeenCalledTimes(3);
      // The rollback call passes negative qty for p1
      expect(mockProductsService.decrementStock).toHaveBeenCalledWith('p1', -2);
    });

    it('throws BadRequestException when cart is empty', async () => {
      mockCartService.getCart.mockResolvedValue({ items: [] });

      await expect(
        service.createFromCart('user-1', { shippingAddress: mockAddress }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createFromCart — price snapshot', () => {
    it('uses priceAtAdd from cart, not current product price', async () => {
      const cartPrice = 1999; // £19.99 — the price when item was added to cart
      mockCartService.getCart.mockResolvedValue({
        items: [makeCartItem('p1', cartPrice, 1)],
      });
      mockProductsService.decrementStock.mockResolvedValue(makeProduct('p1', 2499)); // price changed since
      mockPaymentService.charge.mockResolvedValue({ success: true, reference: 'PAY-TEST' });
      mockOrderModel.create.mockImplementation((data) => data);

      const order = await service.createFromCart('user-1', { shippingAddress: mockAddress });

      expect(order.items[0].price).toBe(cartPrice);
      // Total should be based on cart price, not current product price
      expect(order.subtotal).toBe(cartPrice);
    });

    it('applies free shipping when subtotal >= £50 (5000 pence)', async () => {
      mockCartService.getCart.mockResolvedValue({
        items: [makeCartItem('p1', 5000, 1)], // exactly £50
      });
      mockProductsService.decrementStock.mockResolvedValue(makeProduct('p1', 5000));
      mockPaymentService.charge.mockResolvedValue({ success: true, reference: 'PAY-TEST' });
      mockOrderModel.create.mockImplementation((data) => data);

      const order = await service.createFromCart('user-1', { shippingAddress: mockAddress });

      expect(order.shipping).toBe(0);
      expect(order.total).toBe(5000);
    });

    it('charges £4.99 shipping when subtotal < £50', async () => {
      mockCartService.getCart.mockResolvedValue({
        items: [makeCartItem('p1', 4999, 1)], // one pence short of free shipping
      });
      mockProductsService.decrementStock.mockResolvedValue(makeProduct('p1', 4999));
      mockPaymentService.charge.mockResolvedValue({ success: true, reference: 'PAY-TEST' });
      mockOrderModel.create.mockImplementation((data) => data);

      const order = await service.createFromCart('user-1', { shippingAddress: mockAddress });

      expect(order.shipping).toBe(499);
      expect(order.total).toBe(4999 + 499);
    });
  });
});
