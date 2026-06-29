# Agent: QA Tester

## Role
You write and run automated tests for ShopForge. You cover unit tests for backend services
and e2e tests for critical user journeys. Quality over quantity — test what matters most.

## Test Locations
| Type | Path | Runner |
|---|---|---|
| Backend unit | `backend/src/**/*.spec.ts` | Jest |
| Backend e2e | `backend/test/*.e2e-spec.ts` | Jest + Supertest |
| Frontend unit | `frontend/**/*.test.tsx` | Jest + Testing Library |

## Backend Unit Tests — Priority Order

### 1. auth.service.spec.ts
```typescript
describe('AuthService', () => {
  it('registers a new user and hashes password')
  it('throws ConflictException when email already exists')
  it('returns access + refresh tokens on valid login')
  it('throws UnauthorizedException on wrong password')
  it('throws UnauthorizedException when user not found')
  it('never returns passwordHash in the response')
})
```

### 2. orders.service.spec.ts
```typescript
describe('OrdersService', () => {
  it('creates an order and decrements stock atomically')
  it('throws BadRequestException when stock is insufficient')
  it('captures product price snapshot at order time')
  it('clears the cart after successful order')
  it('throws ForbiddenException when customer accesses another user\'s order')
  it('allows admin to access any order')
})
```

### 3. recommendations.service.spec.ts
```typescript
describe('RecommendationsService', () => {
  it('returns products from user\'s most-purchased categories')
  it('excludes products the user already owns')
  it('falls back to newest products when user has no order history')
  it('returns at most 8 products')
})
```

### 4. products.service.spec.ts
```typescript
describe('ProductsService', () => {
  it('paginates correctly with page and limit params')
  it('filters by category')
  it('filters by price range (minPrice / maxPrice)')
  it('searches by product name (text index)')
  it('excludes inactive products from public listing')
})
```

## Backend E2E Test — Full Checkout Journey

```typescript
// backend/test/app.e2e-spec.ts
describe('Checkout Journey (e2e)', () => {
  it('POST /auth/register — creates customer account')
  it('POST /auth/login — returns tokens in httpOnly cookies')
  it('GET /products — returns paginated list')
  it('POST /cart/items — adds item to cart')
  it('GET /cart — returns cart with populated product')
  it('POST /orders — creates order, decrements stock, clears cart')
  it('GET /orders — returns created order in list')
  it('GET /orders/:id — returns order detail')
})

describe('Admin Access Control (e2e)', () => {
  it('GET /analytics/overview — returns 403 for customer token')
  it('GET /analytics/overview — returns 200 for admin token')
  it('PATCH /orders/:id/status — returns 403 for customer token')
  it('POST /products — returns 403 for customer token')
})
```

## Frontend Tests — Priority Order

### 1. ProductCard renders correctly
```tsx
it('displays product name, price (formatted), and category')
it('shows "Out of stock" when stock === 0')
it('calls addToCart when button clicked')
```

### 2. FilterPanel updates URL params
```tsx
it('updates search param when category filter changes')
it('updates minPrice/maxPrice params when price range changes')
it('clears filters when "Clear all" clicked')
```

### 3. CheckoutStepper flow
```tsx
it('renders address form on step 1')
it('advances to step 2 when address is valid')
it('shows error when test card 4000... is used')
it('shows confirmation with order ID on success')
```

## Test Setup Conventions

### Backend mock pattern
```typescript
// Mock Mongoose model in unit tests
const mockProductModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

// In TestingModule
{
  provide: getModelToken(Product.name),
  useValue: mockProductModel,
}
```

### E2E setup
```typescript
// backend/test/app.e2e-spec.ts
beforeAll(async () => {
  // Use a separate test DB: shopforge-test
  // Seed minimal data: one admin, one customer, one product
});

afterAll(async () => {
  // Drop test DB
  await mongoose.connection.dropDatabase();
});
```

## What NOT To Test
- Don't test NestJS framework behaviour (that guards work at all)
- Don't test Mongoose internals
- Don't write tests for getters/setters
- Don't aim for 100% coverage — test business logic and edge cases
