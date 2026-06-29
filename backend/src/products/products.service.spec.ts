import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

const makeProduct = (overrides = {}) => ({
  _id: 'product-id-1',
  name: 'Test Headphones',
  slug: 'test-headphones',
  price: 4999,
  stock: 20,
  isActive: true,
  category: 'category-id-1',
  ...overrides,
});

function buildModelMock(items: unknown[] = []) {
  const query = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(items),
    select: jest.fn().mockReturnThis(),
  };
  return {
    find: jest.fn().mockReturnValue(query),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
    countDocuments: jest.fn().mockResolvedValue(items.length),
    create: jest.fn(),
    _query: query,
  };
}

describe('ProductsService', () => {
  let service: ProductsService;
  let model: ReturnType<typeof buildModelMock>;

  beforeEach(async () => {
    model = buildModelMock([makeProduct()]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getModelToken(Product.name), useValue: model },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll — pagination', () => {
    it('returns paginated data with correct metadata', async () => {
      model.countDocuments.mockResolvedValue(45);

      const result = await service.findAll({ page: 2, limit: 20 });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.total).toBe(45);
      expect(result.totalPages).toBe(3);
    });

    it('skips the right number of records for page 3', async () => {
      await service.findAll({ page: 3, limit: 10 });
      // skip = (3-1) * 10 = 20
      expect(model._query.skip).toHaveBeenCalledWith(20);
    });
  });

  describe('findAll — search filter', () => {
    it('applies $text search when search param is provided', async () => {
      await service.findAll({ search: 'headphones' });
      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ $text: { $search: 'headphones' } }),
      );
    });

    it('does not set $text when search is absent', async () => {
      await service.findAll({});
      const [filter] = (model.find as jest.Mock).mock.calls[0];
      expect(filter).not.toHaveProperty('$text');
    });
  });

  describe('findAll — price range filter', () => {
    it('applies $gte when only minPrice is given', async () => {
      await service.findAll({ minPrice: 1000 });
      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ price: { $gte: 1000 } }),
      );
    });

    it('applies $lte when only maxPrice is given', async () => {
      await service.findAll({ maxPrice: 5000 });
      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ price: { $lte: 5000 } }),
      );
    });

    it('applies both bounds when both are given', async () => {
      await service.findAll({ minPrice: 1000, maxPrice: 5000 });
      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ price: { $gte: 1000, $lte: 5000 } }),
      );
    });
  });

  describe('findBySlug', () => {
    it('throws NotFoundException when product does not exist', async () => {
      model.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findBySlug('nonexistent-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('throws ConflictException when slug already exists', async () => {
      model.findOne.mockResolvedValue(makeProduct());

      await expect(
        service.create({ name: 'Test Headphones', price: 4999, stock: 10, category: 'cat-1', description: '' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('decrementStock', () => {
    it('returns null when stock is insufficient (atomic check)', async () => {
      model.findOneAndUpdate.mockResolvedValue(null);

      const result = await service.decrementStock('product-id-1', 999);

      expect(result).toBeNull();
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'product-id-1', stock: { $gte: 999 } },
        { $inc: { stock: -999 } },
        { new: true },
      );
    });

    it('returns the updated product when stock is sufficient', async () => {
      const updated = makeProduct({ stock: 17 });
      model.findOneAndUpdate.mockResolvedValue(updated);

      const result = await service.decrementStock('product-id-1', 3);

      expect(result).toEqual(updated);
    });
  });
});
