# ShopForge — Execution Plan

Production-ready full-stack e-commerce platform.
Each phase is split into **Backend (BE)** and **Frontend (FE)** tracks where applicable.

---

## Progress Legend
```
✅  Complete
🔄  In Progress
⏳  Pending
🐳  Requires Docker
```

---

## Phase 1 — Project Setup ✅
> Both apps scaffolded, configured, committed, and pushed.

| Track | Item | Status |
|---|---|---|
| Root | Monorepo orchestrator (`concurrently`) | ✅ |
| Root | `.nvmrc` Node 25, `.gitignore`, `README.md`, `CLAUDE.md` | ✅ |
| Root | `.claude/` harness (agents, rules, skills, hooks, pipeline) | ✅ |
| BE | NestJS scaffolded — port **8000** | ✅ |
| BE | Swagger at `localhost:8000/api` | ✅ |
| BE | `backend/.env` configured | ✅ |
| FE | Next.js 16 scaffolded — port **3000** | ✅ |
| FE | `frontend/.env.local` configured | ✅ |
| Git | Initial commit pushed to `main` | ✅ |

---

## Phase 2 — Infrastructure & Database 🐳
> Docker MongoDB running. All dependencies installed. Project boots end-to-end.

### 2.1 — Docker / Database Setup
| Item | Status |
|---|---|
| `docker-compose.yml` — MongoDB + Mongo Express | ⏳ |
| MongoDB running on `localhost:27017` | ⏳ |
| Mongo Express UI at `localhost:8081` | ⏳ |
| `backend/.env` `MONGODB_URI` verified | ⏳ |

### 2.2 — Backend Dependencies
| Package | Purpose | Status |
|---|---|---|
| `@nestjs/mongoose` + `mongoose` | MongoDB ORM | ⏳ |
| `@nestjs/config` | Env var management | ⏳ |
| `@nestjs/passport` + `passport-jwt` | Auth strategies | ⏳ |
| `@nestjs/jwt` | JWT signing/verification | ⏳ |
| `bcrypt` + `@types/bcrypt` | Password hashing | ⏳ |
| `@nestjs/serve-static` | Serve uploaded files | ⏳ |
| `multer` + `@types/multer` | File upload handling | ⏳ |

### 2.3 — Frontend Dependencies
| Package | Purpose | Status |
|---|---|---|
| `@tanstack/react-query` | Server state / data fetching | ⏳ |
| `zustand` | Client UI state | ⏳ |
| `framer-motion` | Animations | ⏳ |
| `next-themes` | Dark / light / system mode | ⏳ |
| `react-hook-form` + `@hookform/resolvers` + `zod` | Forms + validation | ⏳ |
| `recharts` | Admin charts | ⏳ |
| `sonner` | Toast notifications | ⏳ |
| `clsx` + `tailwind-merge` | Class utilities | ⏳ |
| `lucide-react` | Icons | ⏳ |

**Validation:** `npm run dev` — both apps start. `localhost:8000/api` shows Swagger. DB connects without error.

---

## Phase 3 — Auth Module
> Register, login, refresh, logout. JWT access token (15 min) + refresh token (7 days) in httpOnly cookies.

### 3A — Backend
| Item | Status |
|---|---|
| `users/schemas/user.schema.ts` — name, email, passwordHash, refreshToken (hashed), role | ⏳ |
| `users/users.service.ts` — findByEmail, findById | ⏳ |
| `auth/dto/register.dto.ts` + `login.dto.ts` | ⏳ |
| `auth/strategies/jwt.strategy.ts` | ⏳ |
| `auth/strategies/jwt-refresh.strategy.ts` | ⏳ |
| `auth/guards/jwt-auth.guard.ts` + `roles.guard.ts` | ⏳ |
| `common/decorators/current-user.decorator.ts` + `roles.decorator.ts` | ⏳ |
| `common/pipes/parse-mongo-id.pipe.ts` | ⏳ |
| `common/filters/global-exception.filter.ts` | ⏳ |
| `auth/auth.service.ts` — register, login (bcrypt verify, set cookies), refresh, logout | ⏳ |
| `auth/auth.controller.ts` — POST `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, GET `/auth/me` | ⏳ |
| bcrypt 12 rounds, tokens in httpOnly cookies, refreshToken stored as bcrypt hash | ⏳ |
| Strip `passwordHash` + `refreshToken` from all user JSON responses | ⏳ |
| Swagger docs on all endpoints | ⏳ |

### 3B — Frontend
| Item | Status |
|---|---|
| `lib/api/client.ts` — base fetch with `credentials: include`, auto-refresh on 401 | ⏳ |
| `lib/api/auth.ts` — register, login, logout, getMe | ⏳ |
| `lib/hooks/use-auth.ts` — useLogin, useRegister, useLogout, useMe | ⏳ |
| `lib/stores/auth.store.ts` — user state, setUser, clearUser | ⏳ |
| `types/user.ts` | ⏳ |
| `app/(storefront)/auth/login/page.tsx` — RHF + Zod form, redirect on success | ⏳ |
| `app/(storefront)/auth/register/page.tsx` — RHF + Zod form | ⏳ |
| `app/admin/layout.tsx` — server-side auth guard, redirect non-admin to `/auth/login` | ⏳ |
| `components/layout/navbar.tsx` — show login/register or user avatar based on auth state | ⏳ |

**Validation:** Register → Login → cookie set → `/auth/me` returns user → Logout clears cookie.

---

## Phase 4 — Categories & Products Module
> Full product catalog with image upload. Admin CRUD. Customer browse + search + filter.

### 4A — Backend
| Item | Status |
|---|---|
| `categories/schemas/category.schema.ts` — name, slug, description | ⏳ |
| `categories/dto/create-category.dto.ts` + `update-category.dto.ts` | ⏳ |
| `categories/categories.service.ts` — CRUD, auto slug | ⏳ |
| `categories/categories.controller.ts` — GET all (public), POST/PATCH/DELETE (admin) | ⏳ |
| `upload/upload.module.ts` — Multer config, UUID prefix, MIME validation (jpg/png/webp) | ⏳ |
| `upload/upload.controller.ts` — POST `/upload/image` (admin only) | ⏳ |
| `ServeStaticModule` — expose `backend/uploads/` at `/uploads/*` | ⏳ |
| `products/schemas/product.schema.ts` — name, slug, description, price (int), stock, category ref, imageUrl, isActive | ⏳ |
| `products/dto/create-product.dto.ts` + `update-product.dto.ts` | ⏳ |
| `products/products.service.ts` — paginated list (search, filter by category/price), findBySlug, create, update, delete, toggle isActive | ⏳ |
| `products/products.controller.ts` — GET all (public), GET by slug (public), POST/PATCH/DELETE (admin) | ⏳ |
| Text search index on `name`, compound index on `category + isActive`, price index | ⏳ |
| Price stored as integer (pence) — no floats | ⏳ |

### 4B — Frontend
| Item | Status |
|---|---|
| `types/product.ts` | ⏳ |
| `lib/api/products.ts` — getAll (with filters), getBySlug, create, update, delete | ⏳ |
| `lib/hooks/use-products.ts` — useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct | ⏳ |
| `components/ui/` — button, input, badge, select, skeleton, modal, data-table | ⏳ |
| `components/storefront/product-card.tsx` | ⏳ |
| `components/storefront/product-grid.tsx` | ⏳ |
| `components/storefront/filter-panel.tsx` — category, price range | ⏳ |
| `components/storefront/sort-bar.tsx` | ⏳ |
| `app/(storefront)/products/page.tsx` — search, filter, sort, paginate | ⏳ |
| `app/(storefront)/products/[slug]/page.tsx` — detail, add to cart | ⏳ |
| `app/admin/products/page.tsx` — data table, CRUD actions | ⏳ |
| `app/admin/products/new/page.tsx` — create form with image upload | ⏳ |
| `app/admin/products/[id]/edit/page.tsx` — edit form | ⏳ |
| `components/admin/product-form.tsx` — shared create/edit form | ⏳ |
| `components/admin/image-uploader.tsx` — drag-and-drop upload to `/upload/image` | ⏳ |
| `formatPrice(pence)` utility — `£29.99` display | ⏳ |
| `getImageUrl(path)` utility — prefix with API base URL | ⏳ |

**Validation:** Create product via admin form with image. View on storefront. Filter + search works. Image displays.

---

## Phase 5 — Cart Module
> One cart per user. Price snapshot on add. Full cart management.

### 5A — Backend
| Item | Status |
|---|---|
| `cart/schemas/cart.schema.ts` — user ref (unique), items[{ product ref, qty, priceAtAdd }] | ⏳ |
| `cart/dto/add-cart-item.dto.ts` + `update-cart-item.dto.ts` | ⏳ |
| `cart/cart.service.ts` — getCart (with populate), addItem (snapshot price), updateQty, removeItem, clearCart | ⏳ |
| `cart/cart.controller.ts` — GET/POST/PATCH/DELETE `/cart` (all JwtAuthGuard) | ⏳ |
| `priceAtAdd` snapshot — price changes do not silently update cart | ⏳ |
| Customer can only access their own cart (`user._id` filter) | ⏳ |

### 5B — Frontend
| Item | Status |
|---|---|
| `lib/api/cart.ts` — getCart, addItem, updateItem, removeItem, clearCart | ⏳ |
| `lib/hooks/use-cart.ts` — useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem | ⏳ |
| `lib/stores/cart.store.ts` — isOpen (drawer state) | ⏳ |
| `types/` cart types | ⏳ |
| `components/storefront/cart-item.tsx` — qty controls, remove button | ⏳ |
| `components/storefront/cart-drawer.tsx` — slide-in cart summary | ⏳ |
| `components/ui/drawer.tsx` | ⏳ |
| `app/(storefront)/cart/page.tsx` — full cart page, line items, totals | ⏳ |
| Add-to-cart button on product card + detail page | ⏳ |
| Cart item count badge in navbar | ⏳ |

**Validation:** Add 3 items to cart. Verify `priceAtAdd` snapshot in DB. Update qty. Remove item. Cart persists after page reload.

---

## Phase 6 — Orders & Mock Payment
> Checkout creates order with atomic stock decrement and price snapshot. Mock payment (success/fail).

### 6A — Backend
| Item | Status |
|---|---|
| `orders/schemas/order.schema.ts` — user ref, items[{ productId, name, price, qty, imageUrl }] (snapshot), totalAmount, status, shippingAddress, paymentRef | ⏳ |
| `orders/dto/create-order.dto.ts` — shippingAddress, paymentMethod | ⏳ |
| `orders/dto/update-order-status.dto.ts` — status enum | ⏳ |
| `orders/payment/mock-payment.service.ts` — card 4242=success, 4000=decline, 5105=error | ⏳ |
| `orders/orders.service.ts` — createFromCart (atomic stock decrement, price snapshot, clear cart), findByUser, findById, updateStatus (admin) | ⏳ |
| `orders/orders.controller.ts` — POST `/orders` (auth), GET `/orders` (auth), GET `/orders/:id` (auth), PATCH `/orders/:id/status` (admin) | ⏳ |
| Atomic stock: `findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })` | ⏳ |
| 409 Conflict on insufficient stock | ⏳ |
| Customer can only see their own orders | ⏳ |
| Status lifecycle: `pending → processing → shipped → delivered` / `cancelled` | ⏳ |

### 6B — Frontend
| Item | Status |
|---|---|
| `types/order.ts` | ⏳ |
| `lib/api/orders.ts` — createOrder, getOrders, getOrder | ⏳ |
| `lib/hooks/use-orders.ts` — useOrders, useOrder, useCreateOrder | ⏳ |
| `components/storefront/checkout-stepper.tsx` — step 1: address, step 2: payment, step 3: confirmation | ⏳ |
| `app/(storefront)/checkout/page.tsx` — 3-step checkout flow | ⏳ |
| `components/storefront/order-status-timeline.tsx` | ⏳ |
| `app/(storefront)/orders/page.tsx` — order history list | ⏳ |
| `app/(storefront)/orders/[id]/page.tsx` — order detail, items snapshot, status timeline | ⏳ |
| `app/admin/orders/page.tsx` — all orders table, filterable by status | ⏳ |
| `app/admin/orders/[id]/page.tsx` — order detail + status updater | ⏳ |
| `components/admin/status-updater.tsx` | ⏳ |
| Redirect to order confirmation on success | ⏳ |

**Validation:** Full checkout journey — add to cart → checkout → order created → stock decremented → cart cleared. Test 4242 (success) and 4000 (decline).

---

## Phase 7 — Analytics & Recommendations
> Admin KPI dashboard. Personalised product recommendations from purchase history.

### 7A — Backend
| Item | Status |
|---|---|
| `analytics/analytics.service.ts` — totalRevenue, ordersByStatus, top5Products, dailyRevenue (last 30 days) | ⏳ |
| `analytics/analytics.controller.ts` — GET `/analytics/summary` (admin) | ⏳ |
| `recommendations/recommendations.service.ts` — last 20 orders → top 2 categories → up to 8 products (exclude owned) → fallback to newest | ⏳ |
| `recommendations/recommendations.controller.ts` — GET `/recommendations` (auth) | ⏳ |

### 7B — Frontend
| Item | Status |
|---|---|
| `lib/api/analytics.ts` + `recommendations.ts` | ⏳ |
| `lib/hooks/use-recommendations.ts` | ⏳ |
| `components/admin/stat-card.tsx` | ⏳ |
| `components/admin/revenue-chart.tsx` — Recharts area chart, 30-day revenue | ⏳ |
| `components/admin/order-status-chart.tsx` — Recharts pie/donut chart | ⏳ |
| `components/admin/top-products-table.tsx` | ⏳ |
| `app/admin/page.tsx` — dashboard with all KPI widgets | ⏳ |
| `components/storefront/recommendation-rail.tsx` — horizontal scroll, personalised | ⏳ |
| `app/(storefront)/page.tsx` — homepage with hero, featured products, recommendation rail | ⏳ |

### 7C — Seed Script
| Item | Status |
|---|---|
| `backend/seed.ts` — 1 admin, 1 customer, 5 categories, 20 products (4/category), 3 orders | ⏳ |
| Run: `cd backend && npx ts-node seed.ts` | ⏳ |

**Validation:** Admin dashboard shows real data. Logged-in customer sees recommendations based on seeded orders.

---

## Phase 8 — Design Polish & Theme System
> Premium UI. Dark/light/system mode. Theme customisation panel. Font picker. Animations.

| Item | Status |
|---|---|
| `app/globals.css` — full CSS variable token system (colors, radius, spacing) | ⏳ |
| `tailwind.config.ts` — semantic color extensions from CSS vars | ⏳ |
| `next-themes` ThemeProvider in root layout | ⏳ |
| Dark mode — all pages correct in both modes | ⏳ |
| `components/layout/theme-panel.tsx` — floating panel, primary color picker, border radius | ⏳ |
| `components/layout/font-panel.tsx` — font family picker (Inter, Geist, DM Sans, etc.) | ⏳ |
| `lib/stores/theme.store.ts` — persist theme + font preferences | ⏳ |
| Framer Motion — card entrances, staggered product grids | ⏳ |
| Framer Motion — drawer/modal open/close transitions | ⏳ |
| `useReducedMotion()` guard on all animations | ⏳ |
| Responsive — all pages verified on mobile (375px) → tablet (768px) → desktop (1280px) | ⏳ |
| Skeleton loaders on all data-fetching components | ⏳ |
| Empty states — cart, orders, search results | ⏳ |
| `components/layout/footer.tsx` | ⏳ |
| Storefront layout — `app/(storefront)/layout.tsx` with Navbar + Footer | ⏳ |
| Admin layout — `app/admin/layout.tsx` with sidebar + mobile drawer | ⏳ |
| `components/layout/admin-sidebar.tsx` — hidden on mobile, drawer on sm | ⏳ |

**Validation:** Toggle dark mode. Change primary color. Change font. All pages responsive. Animations play (and respect reduced-motion).

---

## Phase 9 — Testing
> Unit tests for all service logic. E2e test for full checkout journey.

| Test File | What It Covers | Status |
|---|---|---|
| `auth.service.spec.ts` | Register (success, duplicate email), login (valid credentials, wrong password) | ⏳ |
| `products.service.spec.ts` | Pagination, text search filter, price range filter | ⏳ |
| `orders.service.spec.ts` | Insufficient stock → 409, price snapshot correctness | ⏳ |
| `recommendations.service.spec.ts` | Category affinity ranking, fallback to newest when no history | ⏳ |
| `app.e2e-spec.ts` | Register → add to cart → checkout → order created → stock decremented | ⏳ |

**Run:** `npm run test --prefix backend` — all suites pass.

---

## Phase 10 — Security Review & Production Hardening

### Security Checklist
| Item | Status |
|---|---|
| All admin endpoints behind `JwtAuthGuard` + `RolesGuard` + `@Roles('admin')` | ⏳ |
| Customers can only read their own cart and orders (filter by `user._id`) | ⏳ |
| `passwordHash` and `refreshToken` never returned in any response | ⏳ |
| Refresh token stored as bcrypt hash in DB — not plain text | ⏳ |
| Tokens set as httpOnly cookies — never in response body or localStorage | ⏳ |
| No secrets hardcoded in source — all from `process.env.*` | ⏳ |
| File upload MIME type validated server-side (jpeg/png/webp only) | ⏳ |
| `ParseMongoIdPipe` on all `:id` params — prevents injection | ⏳ |
| CORS locked to `FRONTEND_URL` — never `'*'` | ⏳ |
| `GlobalExceptionFilter` — no stack traces leaked in production | ⏳ |
| `ValidationPipe` with `whitelist: true` + `forbidNonWhitelisted: true` | ⏳ |

### Production Build
| Item | Status |
|---|---|
| `npm run build` — backend compiles without errors | ⏳ |
| `npm run build` — frontend compiles without errors | ⏳ |
| TypeScript strict — zero `any`, zero type errors | ⏳ |
| All `console.log` debug statements removed from source | ⏳ |
| `.env.example` files up to date | ⏳ |
| `backend/uploads/.gitkeep` committed, uploads themselves gitignored | ⏳ |

---

## Phase 11 — Final Ship
> Clean commit history. Seed verified. README final.

| Item | Status |
|---|---|
| Seed script runs cleanly against fresh DB | ⏳ |
| `README.md` final — setup instructions verified end-to-end | ⏳ |
| All feature branches merged to `main` | ⏳ |
| Final commit with conventional message | ⏳ |
| Pushed to remote | ⏳ |

---

## Module Dependency Order

```
Phase 2  →  Phase 3  →  Phase 4  →  Phase 5  →  Phase 6  →  Phase 7
(Deps)      (Auth)      (Products)   (Cart)      (Orders)    (Analytics)
                ↓           ↓           ↓           ↓
             FE Auth    FE Products  FE Cart    FE Orders
```

Auth must exist before Cart and Orders.
Products must exist before Cart (add item needs product ID).
Cart must exist before Orders (checkout reads from cart).

---

## Quick Commands

```bash
# Start Docker (MongoDB)
docker-compose up -d

# Start both apps
npm run dev

# Backend only
npm run dev:be          # http://localhost:8000/api

# Frontend only
npm run dev:fe          # http://localhost:3000

# Seed database
cd backend && npx ts-node seed.ts

# Run all tests
npm run test

# Production build
npm run build
```

---

## Seeded Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@shopforge.com | Admin@123! |
| Customer | customer@shopforge.com | Customer@123! |

## Mock Payment Cards
| Card Number | Result |
|---|---|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |
| 5105 1051 0510 5100 | Processing Error |
