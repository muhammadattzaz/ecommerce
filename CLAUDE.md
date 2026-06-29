# ShopForge — Claude Code Project Context

This file gives Claude Code full context about the monorepo structure, conventions, and commands so every session starts with accurate project knowledge.

> **Before writing any code**, read the relevant rule file:
> - Backend work → `.claude/rules/backend.md`
> - Frontend work → `.claude/rules/frontend.md`
> - Use the appropriate agent from `.claude/agents/` for specialised tasks.
> - For a full feature, run `/pipeline-start <description>` to invoke the 9-stage pipeline.

---

## Project Overview

Full-stack e-commerce platform. Two apps, one API, one MongoDB database.

- **Backend:** NestJS 10 REST API — `backend/` — port **3001**
- **Frontend:** Next.js 14 (App Router) — `frontend/` — port **3000**
- **Monorepo tooling:** Turborepo
- **Database:** MongoDB via Mongoose
- **Auth:** JWT access token (15 min) + refresh token (7 days) in httpOnly cookies
- **Node.js:** 25 (pinned in `.nvmrc`)

---

## Folder Paths

### Backend — `backend/`

```
backend/
├── src/
│   ├── auth/                        # JWT auth, Passport strategies, guards
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── schemas/
│   │       └── user.schema.ts
│   │
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   └── schemas/
│   │       └── product.schema.ts
│   │
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   └── schemas/
│   │       └── category.schema.ts
│   │
│   ├── cart/
│   │   ├── cart.module.ts
│   │   ├── cart.controller.ts
│   │   ├── cart.service.ts
│   │   ├── dto/
│   │   │   ├── add-cart-item.dto.ts
│   │   │   └── update-cart-item.dto.ts
│   │   └── schemas/
│   │       └── cart.schema.ts
│   │
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── payment/
│   │   │   └── mock-payment.service.ts
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts
│   │   │   └── update-order-status.dto.ts
│   │   └── schemas/
│   │       └── order.schema.ts
│   │
│   ├── upload/
│   │   ├── upload.module.ts
│   │   ├── upload.controller.ts
│   │   └── upload.service.ts
│   │
│   ├── analytics/
│   │   ├── analytics.module.ts
│   │   ├── analytics.controller.ts
│   │   └── analytics.service.ts
│   │
│   ├── recommendations/
│   │   ├── recommendations.module.ts
│   │   ├── recommendations.controller.ts
│   │   └── recommendations.service.ts
│   │
│   └── common/
│       ├── decorators/
│       │   ├── current-user.decorator.ts
│       │   └── roles.decorator.ts
│       ├── filters/
│       │   └── global-exception.filter.ts
│       └── pipes/
│           └── parse-mongo-id.pipe.ts
│
├── uploads/                         # Multer file storage — served at /uploads/*
├── test/
│   └── app.e2e-spec.ts
├── seed.ts                          # Database seed script
├── .env
├── .env.example
└── nest-cli.json
```

### Frontend — `frontend/`

```
frontend/
├── app/
│   ├── (storefront)/                # Public customer-facing routes
│   │   ├── layout.tsx               # Storefront shell (Navbar, Footer)
│   │   ├── page.tsx                 # Homepage — hero, featured, recommendations
│   │   ├── products/
│   │   │   ├── page.tsx             # Product catalog — search, filter, sort, paginate
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Product detail — full info, add-to-cart
│   │   ├── cart/
│   │   │   └── page.tsx             # Cart page — line items, totals
│   │   ├── checkout/
│   │   │   └── page.tsx             # 3-step checkout — address, payment, confirmation
│   │   ├── orders/
│   │   │   ├── page.tsx             # Order history list
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Order detail — items snapshot, status timeline
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   │
│   ├── admin/                       # Protected admin panel
│   │   ├── layout.tsx               # Admin shell + server-side auth guard
│   │   ├── page.tsx                 # Dashboard — KPIs, charts, top products
│   │   ├── products/
│   │   │   ├── page.tsx             # Product data table + CRUD actions
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Create product form
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx     # Edit product form
│   │   └── orders/
│   │       ├── page.tsx             # All orders table — filterable by status
│   │       └── [id]/
│   │           └── page.tsx         # Order detail + status update
│   │
│   ├── globals.css                  # CSS variables, theme tokens, base reset
│   └── layout.tsx                   # Root layout — ThemeProvider, QueryProvider, Toaster
│
├── components/
│   ├── ui/                          # Base design system — no business logic
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── drawer.tsx
│   │   ├── data-table.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── toast.tsx
│   │
│   ├── storefront/                  # Customer-facing composed components
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── filter-panel.tsx
│   │   ├── sort-bar.tsx
│   │   ├── cart-item.tsx
│   │   ├── cart-drawer.tsx
│   │   ├── checkout-stepper.tsx
│   │   ├── order-status-timeline.tsx
│   │   └── recommendation-rail.tsx
│   │
│   ├── admin/                       # Admin-specific components
│   │   ├── stat-card.tsx
│   │   ├── revenue-chart.tsx
│   │   ├── order-status-chart.tsx
│   │   ├── top-products-table.tsx
│   │   ├── product-form.tsx
│   │   ├── image-uploader.tsx
│   │   └── status-updater.tsx
│   │
│   └── layout/
│       ├── navbar.tsx
│       ├── footer.tsx
│       ├── admin-sidebar.tsx
│       ├── theme-panel.tsx          # Floating theme customisation panel
│       └── font-panel.tsx          # Font family picker
│
├── lib/
│   ├── api/                         # Typed fetch wrappers for every endpoint
│   │   ├── client.ts                # Base fetch with auth headers + error handling
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── analytics.ts
│   │   └── recommendations.ts
│   │
│   ├── hooks/                       # Custom React hooks (wrap TanStack Query)
│   │   ├── use-auth.ts
│   │   ├── use-products.ts
│   │   ├── use-cart.ts
│   │   ├── use-orders.ts
│   │   └── use-recommendations.ts
│   │
│   └── stores/                      # Zustand client-only state
│       ├── auth.store.ts
│       ├── cart.store.ts
│       └── theme.store.ts
│
├── types/
│   ├── api.ts                       # API response shapes
│   ├── product.ts
│   ├── order.ts
│   └── user.ts
│
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
└── .env.example
```

---

## Key Commands

```bash
# Install all workspace deps (run from root)
npm install

# Run both apps in dev mode (root)
npm run dev

# Run backend only
npm run dev:be

# Run frontend only
npm run dev:fe

# Seed the database
cd backend && npx ts-node seed.ts

# Run all tests
npm run test

# Backend unit tests
npm run test --prefix backend

# Backend e2e tests
cd backend && npm run test:e2e

# Build for production
npm run build
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Example | Purpose |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/shopforge` | MongoDB connection string |
| `JWT_SECRET` | `change-me-in-prod` | Access token signing key |
| `JWT_REFRESH_SECRET` | `change-me-in-prod` | Refresh token signing key |
| `JWT_EXPIRES_IN` | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token TTL |
| `PORT` | `3001` | API port |
| `NODE_ENV` | `development` | Environment |
| `FRONTEND_URL` | `http://localhost:3000` | CORS origin |
| `UPLOAD_DIR` | `uploads` | Multer destination folder |
| `MAX_FILE_SIZE_MB` | `5` | Upload size limit |

### Frontend (`frontend/.env.local`)

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api/v1` | Backend base URL |

---

## Architecture Decisions

### Auth Flow
- POST `/auth/login` sets two httpOnly cookies: `access_token` and `refresh_token`
- All API calls include `credentials: 'include'` to send cookies
- Expired access token triggers an automatic `/auth/refresh` call (intercepted in `lib/api/client.ts`)
- Logout hits `/auth/logout` which clears cookies and nullifies the refresh token hash in the DB

### Price Storage
- All prices stored as **integers (pence/cents)** in MongoDB — e.g. £29.99 = `2999`
- Displayed by dividing by 100: `(price / 100).toFixed(2)`
- Avoids floating-point rounding errors on order totals

### Cart Persistence
- One Cart document per user in MongoDB
- `priceAtAdd` snapshot stored with each cart item — price changes don't silently update the cart
- Cart populated with full product data on `GET /cart` (via Mongoose `.populate()`)

### Order Stock Safety
- Stock decremented atomically: `Product.findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`
- If result is `null`, insufficient stock → return `409 Conflict`
- No separate "reserve" step — keeps it simple and correct for single-region deployment

### File Uploads
- Multer stores files in `backend/uploads/` with UUID-prefixed filenames
- NestJS `ServeStaticModule` exposes them at `http://localhost:3001/uploads/<filename>`
- `imageUrl` on Product schema stores the relative path `/uploads/<filename>`
- Frontend prefixes with `NEXT_PUBLIC_API_URL` base (without `/api/v1`) to build the full URL

### Admin Access Control
- `RolesGuard` checks `req.user.role === 'admin'` on every admin route
- Admin Next.js layout reads the JWT cookie server-side and redirects non-admin users to `/auth/login`
- No admin-accessible UI elements are rendered for customer-role users

---

## Module Conventions (Backend)

Each NestJS module follows this pattern:

```
<module>/
├── <module>.module.ts       # imports, providers, exports
├── <module>.controller.ts   # route handlers, guards, interceptors
├── <module>.service.ts      # all business logic — no Mongoose in controllers
├── dto/
│   ├── create-<module>.dto.ts    # class-validator decorators
│   └── update-<module>.dto.ts    # PartialType(CreateDto)
└── schemas/
    └── <module>.schema.ts        # Mongoose @Schema, @Prop decorators
```

- Controllers never import Mongoose models directly — always go through the service
- DTOs use `class-validator` + `class-transformer` — `ValidationPipe` is global with `whitelist: true`
- Never return `passwordHash` or `refreshToken` fields from user documents (use `@Exclude()` or explicit select)

---

## Component Conventions (Frontend)

- All components are **TypeScript with explicit prop interfaces**
- Base UI components in `components/ui/` accept a `className` prop for extension
- Business components in `components/storefront/` and `components/admin/` use hooks for data
- Data fetching lives in `lib/hooks/` — components never call `lib/api/` directly
- All `use client` components are marked at the top — server components are the default
- Zustand stores are in `lib/stores/` — never import stores directly in server components

---

## Testing Approach

| Test file | What it covers |
|---|---|
| `auth.service.spec.ts` | Register (success, duplicate email), login (valid, wrong password) |
| `orders.service.spec.ts` | Stock guard (insufficient stock → 409), price snapshot correctness |
| `recommendations.service.spec.ts` | Category affinity ranking, fallback to newest when no history |
| `products.service.spec.ts` | Pagination, search filter, price range filter |
| `app.e2e-spec.ts` | Full checkout journey: register → add to cart → checkout → order created |

---

## Seeded Test Data

| Resource | Count | Notes |
|---|---|---|
| Admin user | 1 | `admin@shopforge.com` / `Admin@123!` |
| Customer user | 1 | `customer@shopforge.com` / `Customer@123!` |
| Categories | 5 | Electronics, Clothing, Books, Home & Garden, Sports |
| Products | 20 | 4 per category, varied prices and stock levels |
| Orders | 3 | Pre-seeded for the customer user — various statuses |

---

## Node.js Version

This project requires **Node.js 25** (latest). Use `nvm` or `fnm` to manage versions:

```bash
# nvm
nvm install 25
nvm use 25

# fnm
fnm install 25
fnm use 25
```

A `.nvmrc` file at the root pins the version to `25`.

---

## Claude Code Agent Harness

All agents, rules, skills, hooks, and the pipeline live in `.claude/`.

### Agents (`agents/`)
Invoke these by name when delegating specialised work:

| Agent | When to use |
|---|---|
| `be-developer` | Implementing a new module, endpoint, schema, or DTO |
| `fe-developer` | Building pages, hooks, API client methods, stores |
| `fe-designer` | UI polish, theme tokens, responsive layout, animations |
| `code-reviewer` | Reviewing any changed file before committing |
| `api-reviewer` | Checking REST conventions, guards, Swagger on BE changes |
| `db-reviewer` | Reviewing schema changes, indexes, query patterns |
| `qa-tester` | Writing tests for new or changed service/component |
| `security-reviewer` | Auditing auth, data exposure, secrets before shipping |
| `bug-fixer` | Diagnosing and applying a minimal fix for a reported bug |

### Rules (`rules/`)
Load the relevant rule file before writing code in that area:

| File | Covers |
|---|---|
| `rules/backend.md` | NestJS patterns, Mongoose schemas, DTOs, error handling, security |
| `rules/frontend.md` | Next.js App Router, TanStack Query, Zustand, RHF+Zod, Tailwind |

### Skills (`skills/`)
Slash commands for common tasks:

| Command | What it does |
|---|---|
| `/be-create-module <name>` | Scaffold a full NestJS module (module, controller, service, DTOs, schema) |
| `/be-create-endpoint <module> <METHOD> <path> <guard>` | Add an endpoint to an existing module |
| `/fe-create-component <Name> <layer>` | Scaffold a typed React component in the correct layer |
| `/fe-create-page <route> <storefront\|admin>` | Scaffold a Next.js App Router page with route constant and metadata |
| `/ship [message]` | Stage, commit, and push with a conventional commit message |
| `/debug-fix <description>` | Diagnose a bug and apply the minimal fix |

### Pipeline (`pipeline/PIPELINE.md`)
Run `/pipeline-start <feature description>` for a full feature build:
```
Plan → Backend → Review-BE → Frontend → Design → Review-FE → Test → Security → Ship
```
Each stage uses the appropriate agent and applies the relevant rule file.

### Hooks (`hooks/`)
Automatically enforced on every edit and bash command:

| Hook | Triggers on | Enforces |
|---|---|---|
| `hooks/backend.sh` | Bash, Edit/Write in `backend/` | Blocks dangerous git/DB commands, protects `.env`, scans for hardcoded secrets |
| `hooks/frontend.sh` | Edit/Write in `frontend/` | Protects `.env.local`, format on save (Prettier), warns on hardcoded URLs / hex colors / localStorage token storage |
