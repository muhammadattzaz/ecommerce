# ShopForge — Full-Stack E-Commerce Platform

A production-ready e-commerce platform built with NestJS (API) and Next.js 14 (storefront + admin panel) in a Turborepo monorepo. Includes a customer storefront, admin panel, JWT authentication, mock checkout, and category-based product recommendations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Backend | NestJS 10, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens, httpOnly cookies) |
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand (client), TanStack Query (server) |
| Charts | Recharts |
| File Uploads | Multer → local `uploads/` directory |
| Testing | Jest, Supertest |

---

## Prerequisites

- **Node.js** >= 25.x (latest)
- **npm** >= 10.x
- **MongoDB** >= 6.x — running locally on `mongodb://localhost:27017` or a remote URI

---

## Project Structure

```
ecommerce/
├── backend/          # NestJS backend (port 3001)
├── frontend/         # Next.js frontend (port 3000)
├── .claude/          # Claude Code agent harness (see below)
├── package.json
├── CLAUDE.md         # Full project context for Claude Code
└── .nvmrc            # Node.js 25
```

---

## Environment Setup

### 1. Copy environment files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

### 2. Backend environment variables (`backend/.env`)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/shopforge

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS — must match your frontend URL
FRONTEND_URL=http://localhost:3000

# File uploads — relative to backend/
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5
```

### 3. Frontend environment variables (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## Installation

```bash
# Install all workspace dependencies from the root
npm install
```

---

## Database Seed

Populates MongoDB with sample data: 5 categories, 20 products, 1 admin user, 1 customer user, and sample orders.

```bash
cd backend
npx ts-node seed.ts
```

### Seeded Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@shopforge.com` | `Admin@123!` |
| Customer | `customer@shopforge.com` | `Customer@123!` |

> Run the seed script before starting the app for the first time, and any time you want to reset to clean sample data.

---

## Running the Application

### Development (both apps concurrently)

```bash
# From the root — starts api on :3001 and web on :3000
npm run dev
```

### Run individually

```bash
# Backend only
npm run dev:be

# Frontend only
npm run dev:fe
```

### Production build

```bash
npm run build
npm run start
```

---

## Running Tests

```bash
# All tests
npm run test

# Backend unit tests only
npm run test --prefix backend

# Backend e2e tests
cd backend && npm run test:e2e

# Frontend tests
npm run test --prefix frontend

# With coverage
cd backend && npm run test:cov
```

---

## Application URLs

| URL | Description |
|---|---|
| `http://localhost:3000` | Customer storefront |
| `http://localhost:3000/admin` | Admin panel (admin login required) |
| `http://localhost:3001/api/v1` | REST API base |
| `http://localhost:3001/api/docs` | Swagger API documentation |
| `http://localhost:3001/uploads/*` | Uploaded product images |

---

## API Overview

All API routes are prefixed with `/api/v1`.

| Guard | Meaning |
|---|---|
| Public | No authentication required |
| JWT | Valid access token required (customer or admin) |
| Admin | Valid access token with `admin` role required |

### Auth

```
POST   /auth/register     Public  — create customer account
POST   /auth/login        Public  — returns access + refresh tokens (cookies)
POST   /auth/refresh      Public  — issue new access token from refresh cookie
POST   /auth/logout       JWT     — clear cookies, invalidate refresh token
GET    /auth/me           JWT     — current user profile
```

### Products

```
GET    /products          Public  — paginated list (?page&limit&search&category&minPrice&maxPrice&sort)
GET    /products/:slug    Public  — single product detail
POST   /products          Admin   — create product (multipart/form-data)
PATCH  /products/:id      Admin   — update product
DELETE /products/:id      Admin   — soft delete (isActive → false)
```

### Cart

```
GET    /cart                      JWT  — get user's cart
POST   /cart/items                JWT  — add item { productId, quantity }
PATCH  /cart/items/:productId     JWT  — update item quantity
DELETE /cart/items/:productId     JWT  — remove item
DELETE /cart                      JWT  — clear entire cart
```

### Orders

```
POST   /orders            JWT    — checkout: process payment, create order, clear cart
GET    /orders            JWT    — my orders (customer) / all orders (admin)
GET    /orders/:id        JWT    — order detail (customer sees own orders only)
PATCH  /orders/:id/status Admin  — update order status
```

### Analytics (Admin)

```
GET    /analytics/overview   Admin  — total revenue, order counts by status, top products, daily revenue
```

### Recommendations

```
GET    /recommendations   JWT?  — personalised product suggestions (category affinity + order history)
```

---

## Mock Payment

The checkout uses a simulated payment service — no real money is processed.

| Test Card | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 0002` | Payment declined |

Any expiry date and CVV are accepted. The payment step introduces a 1.5-second artificial delay to simulate a real gateway.

---

## Product Image Uploads

Images are uploaded directly to `backend/uploads/` and served statically at `http://localhost:3001/uploads/<filename>`.

- Accepted formats: JPEG, PNG, WebP
- Max file size: 5 MB (configurable via `MAX_FILE_SIZE_MB`)
- Admin panel includes a drag-and-drop image uploader with preview

No cloud storage (S3/Cloudinary) is required — everything works from a clean clone.

---

## Order Status Lifecycle

```
pending → processing → shipped → delivered
    ↓
cancelled  (from pending or processing only)
```

Status transitions are validated server-side — invalid transitions return `400 Bad Request`.

---

## Product Recommendations

The open-ended requirement is interpreted as **category affinity based on purchase history**:

1. Aggregate the user's last 20 orders and count category frequency per item purchased.
2. Identify the top 2 most-purchased categories ("affinity categories").
3. Return up to 8 active products from those categories, excluding products the user already owns.
4. If fewer than 4 results are found, pad with the newest active products.
5. Unauthenticated users receive the top-selling products from the last 30 days.

Full reasoning documented in `NOTES.md`.

---

## Feature Highlights

- **Dark / Light / System** mode (next-themes, persisted to localStorage)
- **Theme customisation panel** — accent colour hue, border-radius presets
- **Font customisation panel** — choose from Inter, DM Sans, Geist, Nunito
- **Responsive** — mobile-first layouts across storefront and admin
- **SEO** — Next.js metadata API, OG tags on product pages
- **Accessible** — keyboard navigation, focus states, ARIA labels, `prefers-reduced-motion` respected

---

## Security Notes

- Passwords hashed with bcrypt (12 rounds) — never returned in any response
- JWT stored in httpOnly cookies — not accessible to JavaScript
- CORS locked to `FRONTEND_URL` only
- Admin endpoints return `403 Forbidden` for customer-role tokens
- Customers can only access their own cart and orders (ownership enforced in service layer)
- Global `ValidationPipe` with `whitelist: true` — unknown fields stripped from all requests
- File upload validation — MIME type and extension checked server-side
- Secrets loaded from environment variables — none committed to source

---

## Known Limitations & Trade-offs

- **Image uploads** are stored on local disk. In production this would move to S3 or Cloudinary — the `UploadModule` is designed to make that swap straightforward.
- **Mock payment** does not implement webhooks. A real Stripe integration would add webhook handling for async payment confirmation.
- **Recommendations** use a simple category-affinity algorithm. With more time this would be extended to collaborative filtering or embedding-based similarity.
- **No email notifications** — order confirmation is shown in-app only.
- **No rate limiting** on auth endpoints in development mode. Production would add `@nestjs/throttler`.

---

## Folder Conventions

```
backend/src/
├── <module>/
│   ├── <module>.module.ts
│   ├── <module>.controller.ts
│   ├── <module>.service.ts
│   ├── dto/
│   │   ├── create-<module>.dto.ts
│   │   └── update-<module>.dto.ts
│   └── schemas/
│       └── <module>.schema.ts

frontend/
├── app/             # Next.js App Router pages
├── components/
│   ├── ui/          # Base design system components
│   ├── storefront/  # Storefront-specific components
│   ├── admin/       # Admin-specific components
│   └── layout/      # Navbar, Footer, Sidebar
├── lib/
│   ├── api/         # Typed API client
│   ├── hooks/       # Custom React hooks
│   └── stores/      # Zustand stores
└── types/           # TypeScript type definitions
```

---

## Claude Code Agent Harness (`.claude/`)

This project ships with a full Claude Code configuration for agentic development.

### Agents
| Agent | Responsibility |
|---|---|
| `be-developer` | NestJS modules, Mongoose schemas, DTOs, guards |
| `fe-developer` | Next.js pages, hooks, API client, Zustand stores |
| `fe-designer` | Design system, Tailwind tokens, dark mode, animations |
| `code-reviewer` | Full BE + FE code quality review |
| `api-reviewer` | REST conventions, HTTP status codes, Swagger docs |
| `db-reviewer` | MongoDB indexes, atomic ops, data integrity |
| `qa-tester` | Jest unit tests, Supertest e2e tests |
| `security-reviewer` | OWASP checks, auth guards, secrets, data exposure |
| `bug-fixer` | Root-cause diagnosis and minimal fixes |

### Skills (Slash Commands)
| Skill | Usage |
|---|---|
| `/be-create-module` | Scaffold a complete NestJS module |
| `/be-create-endpoint` | Add an endpoint to an existing module |
| `/fe-create-component` | Scaffold a typed React component |
| `/fe-create-page` | Scaffold a Next.js App Router page |
| `/ship` | Stage, commit, and push with conventional message |
| `/debug-fix` | Diagnose and fix a bug with minimal change |

### Pipeline
`/pipeline-start <feature description>` runs a 9-stage automated workflow:
`Plan → Backend → Review-BE → Frontend → Design → Review-FE → Test → Security → Ship`

### Rules
- `.claude/rules/backend.md` — NestJS, Mongoose, DTOs, error handling, security conventions
- `.claude/rules/frontend.md` — Next.js, TanStack Query, Zustand, forms, Tailwind conventions

### Hooks
- `.claude/hooks/backend.sh` — blocks dangerous commands, protects `.env`, scans for hardcoded secrets
- `.claude/hooks/frontend.sh` — protects `.env.local`, format on save, warns on hardcoded URLs and hex colors

---

## Contributing

This is an assessment project. See `NOTES.md` for agent workflow documentation, design decisions, and trade-off reasoning.
