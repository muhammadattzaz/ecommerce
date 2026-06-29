import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RecommendationsService } from './recommendations.service';
import { Order } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';

const makeProduct = (id: string, categoryId: string, overrides = {}) => ({
  _id: { toString: () => id },
  name: `Product ${id}`,
  category: { toString: () => categoryId },
  isActive: true,
  rating: 4.0,
  reviewCount: 100,
  createdAt: new Date(),
  ...overrides,
});

const makeOrder = (productIds: string[], categoryId = 'cat-1') => ({
  items: productIds.map((id) => ({ productId: { toString: () => id }, quantity: 1 })),
});

function buildQueryMock(returnValue: unknown) {
  const q = {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(returnValue),
    select: jest.fn().mockReturnThis(),
  };
  return q;
}

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let orderModel: { find: jest.Mock; _orderQuery?: { find: jest.Mock; limit: jest.Mock } };
  let productModel: {
    find: jest.Mock;
    _query: ReturnType<typeof buildQueryMock>;
  };

  beforeEach(async () => {
    const products = [
      makeProduct('prod-a', 'cat-electronics'),
      makeProduct('prod-b', 'cat-electronics'),
    ];
    const pQuery = buildQueryMock(products);

    const orderQuery = {
      find: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };
    orderModel = { find: jest.fn().mockReturnValue(orderQuery), _orderQuery: orderQuery };
    productModel = { find: jest.fn().mockReturnValue(pQuery), _query: pQuery };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: getModelToken(Order.name), useValue: orderModel },
        { provide: getModelToken(Product.name), useValue: productModel },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  describe('getForUser — no purchase history', () => {
    it('falls back to newest active products when user has no orders', async () => {
      (orderModel as any)._orderQuery.limit.mockResolvedValue([]);

      await service.getForUser('user-no-history', 8);

      // Should query isActive products sorted by newest
      expect(productModel.find).toHaveBeenCalledWith({ isActive: true });
      expect(productModel._query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  describe('getForUser — category affinity', () => {
    it('recommends products from categories the user bought from', async () => {
      const boughtProductId = 'prod-already-bought';
      const orders = [makeOrder([boughtProductId], 'cat-electronics')];
      (orderModel as any)._orderQuery.limit.mockResolvedValue(orders);

      // First call: find bought products to get their categories
      const categoryQueryMock = {
        find: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([makeProduct(boughtProductId, 'cat-electronics')]),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([makeProduct('prod-a', 'cat-electronics')]),
      };
      productModel.find
        .mockReturnValueOnce(categoryQueryMock)    // look up bought products
        .mockReturnValue(productModel._query);     // affinity recommendations

      await service.getForUser('user-1', 4);

      // The affinity query should exclude already-bought products
      const affinityCall = (productModel.find as jest.Mock).mock.calls[1];
      expect(affinityCall[0]).toMatchObject({
        _id: { $nin: expect.arrayContaining([boughtProductId]) },
        isActive: true,
      });
    });
  });
});
