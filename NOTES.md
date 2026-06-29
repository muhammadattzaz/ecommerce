# NOTES.md — Assessment Submission

## Agent Workflow

### Tools Used

**Primary:** Claude Code (CLI) running Claude Sonnet 4.6 inside VS Code.

I ran two parallel Claude Code sessions:
- **Session 1 (this session)** — architecture, backend, data layer, all page logic, tests, documentation.
- **Session 2 (design session)** — UI component design, visual styling, design tokens, homepage layout. I created a `design.md` brief and pointed that session at it.

I coordinated the two sessions explicitly: I told Session 1 to own the data layer and business logic, and Session 2 to own the visual components. Session 1 consumed Session 2's output (navbar, product card, design tokens) without duplicating it.

### How I Structured Prompts and Instructions

The project uses a structured agent harness in `.claude/`:

- **`CLAUDE.md`** — full project context loaded at session start: folder paths, architecture decisions, key commands, environment variables, module conventions, and testing approach. This meant every session started with accurate context rather than rediscovering it.
- **`rules/backend.md`** and **`rules/frontend.md`** — specific coding conventions, patterns, and rules the agent must follow before writing code in each area. Loaded on demand.
- **Agent definitions** in `.claude/agents/` — specialized system prompts for `be-developer`, `fe-developer`, `code-reviewer`, `security-reviewer`, etc. Each has a focused role.
- **Skills** in `.claude/skills/` — slash commands (`/be-create-module`, `/fe-create-page`) that scaffold standardized output.
- **Hooks** in `.claude/hooks/` — shell scripts that run on every Edit/Write, blocking dangerous patterns (hardcoded secrets, token storage in localStorage, `credentials: include` missing from fetches).

For large tasks (e.g. "build the orders module"), I gave the agent a spec: the endpoint signatures, the DTO fields, the guard requirements, and the data integrity rules (atomic stock decrement, price snapshot). For small tasks (e.g. "fix the image URL"), I gave it the exact file and line.

### How I Managed Context

- `CLAUDE.md` kept architecture decisions stable across sessions — the agent didn't need to re-derive the tech stack or file structure each time.
- When sessions ran long, I summarized the last major milestone before hitting the context limit (e.g. "backend complete, frontend data layer done, now building pages").
- I created memory files (`C:\Users\orcalo\.claude\projects\d--ecommerce\memory\`) for persistent facts that should survive session restarts.

---

## Where the Agent Helped and Where It Failed

### Where It Helped

- **Scaffolding repetitive structure** — the NestJS modules (controller → service → DTO → schema) follow an identical pattern. The agent produced all 8 modules consistently without drift.
- **Type-safe plumbing** — the frontend data layer (API clients → TanStack Query hooks → typed components) was connected end-to-end without type mismatches after the initial setup.
- **Security defaults** — the agent applied httpOnly cookie patterns, bcrypt at 12 rounds, and `ParseMongoIdPipe` on every `:id` param without being asked each time, because these were in the rules file.
- **Catching its own errors** — on the TypeScript compile step, it self-corrected errors like `FilterQuery` not being exported from mongoose, and `StringValue` type mismatches in JWT options.

### Where It Failed (and How I Caught and Corrected)

1. **Wrong port in `next.config.ts`** — the design session changed the image `remotePatterns` port to `3001` (the CLAUDE.md default). The backend actually runs on `8000`. The agent wrote code that matched its training data (NestJS default port) rather than the actual environment. I caught this when product images failed to load — ran `curl` to check what port the backend was on, then found and fixed the config.

2. **`getImageUrl` returning a placeholder path that didn't exist** — the agent returned `/images/placeholder.jpg` for null `imageUrl`, but no such file exists in `/public`. The symptom was a broken image icon instead of the designed SVG placeholder. I caught it by inspecting the browser Network tab — 404 on the placeholder URL. Fix: return `null` and let the component's SVG fallback handle it.

3. **Cart API using item `_id` vs product `_id`** — the first version of the cart page called `removeItem(item._id)`, but the backend's `/cart/items/:productId` route uses the product's `_id`, not the cart subdocument's `_id`. The agent generated code consistent with its internal model of how cart APIs work, not the actual backend. I caught this by reading the cart API source (`cartApi.removeItem(productId: string)`) and noting the mismatch. Fix: extract `product._id` from the populated cart item.

4. **`useCallback` unused import** — the agent imported `useCallback` in the products page but never used it. Caught on TypeScript compile (`--noEmit`). Removed.

5. **Seed script port reference in README** — the agent wrote `PORT=3001` everywhere in the README, matching the CLAUDE.md template. Caught by cross-checking against `backend/.env.example`. Fixed all references to `8000`.

6. **Missing price range filter** — the agent built a products page with category filter and sort, but omitted the price range filter required by the spec. I only noticed when validating against the assessment document. The backend already supported `minPrice`/`maxPrice` — the frontend just wasn't wired up.

---

## Supervision & Verification

My verification approach at each stage:

1. **TypeScript compile check** (`npx tsc --noEmit`) after every significant backend and frontend change. This caught ~6 type errors before they became runtime bugs.
2. **`curl` smoke tests** on key API endpoints after the backend was built — auth, products list, cart operations.
3. **Browser + DevTools** for frontend work — Network tab to check request/response payloads, Console for runtime errors, Application tab to verify cookies are set as httpOnly.
4. **Cross-referencing against the spec** — after building each section, I re-read the relevant part of the assessment and checked each bullet point.
5. **Reading agent output before accepting** — I read every significant generated file before moving on. Short files (DTOs, schemas) I scanned; longer files (services, pages) I read in full.

Patterns I specifically looked for:
- Tokens in `localStorage` or response bodies (blocked by hook, also checked manually)
- Missing `credentials: 'include'` on fetch calls
- `passwordHash` or `refreshToken` appearing in any response
- Mongoose queries without `{ $gte: qty }` stock check on decrement

---

## Design Workflow

I used Claude Code's design capability via a separate session. My process:

1. **Created `design.md`** — a detailed brief specifying: Daraz-like aesthetic (orange primary `#F57224`, clean white cards, dark `#1A1A2E` admin sidebar), mobile-first layout, Tailwind v4 with CSS custom properties for tokens, and component requirements.
2. **Directed the design session** to produce: global CSS token system, navbar, footer, product card with SVG fallback, homepage with hero/flash deals/category grid.
3. **Reviewed the output** against the brief — the design session initially had a different admin sidebar color and used hex colors directly in Tailwind classes instead of CSS variables. I corrected these in follow-up instructions.
4. **I handled the page-level data wiring** — the design session produced visual shells; I connected them to real API hooks.

The result is a coherent visual language: orange CTAs, white cards with `#E8E8E8` borders, 4px border-radius throughout, `#0F3460` for action links, and a dark `#1A1A2E` admin sidebar that visually separates the two experiences.

---

## Assumptions

### Open-ended requirement: "product suggestions relevant to them"

**Interpretation:** Category affinity from purchase history — "if you bought Electronics, you'll likely want more Electronics."

**Reasoning:**
- Simple, explainable, and correct for an e-commerce use case.
- Doesn't require a separate ML model, embeddings, or third-party service — works entirely off existing order data in MongoDB.
- Avoids the "you already bought this" problem: recommendations exclude products the user has already purchased.
- Degrades gracefully: users with no history get the newest active products; users who've bought everything in their preferred categories get padded with newest products.
- More sophisticated alternatives (collaborative filtering, vector similarity) would require more data and infrastructure, which is out of scope for a ~6-hour assessment.

**Implementation:**
1. Query the user's last 20 orders.
2. Collect productIds from order items and tally quantities (weight by how much they bought).
3. Resolve those productIds to their categories.
4. Query active products from those categories, excluding already-bought products, sorted by rating.
5. Pad with newest active products if result count < limit.
6. Unauthenticated: return top-rated products globally.

### Other assumptions

- **Price storage as pence (integers)** — avoids all floating-point rounding issues on order totals and shipping calculations. Display layer divides by 100.
- **Mock payment** — always succeeds, returns a `PAY-XXXXXXXX` reference. The checkout UI shows a pre-filled "test card" to make the demo experience clear.
- **Free shipping at £50** — threshold hardcoded in both backend (`SHIPPING_THRESHOLD_PENCE = 5000`) and frontend. Would move to a configuration table in production.
- **Admin route uses separate `/admin/*` path** — not a role-switch within the storefront. Cleaner separation; admin layout has server-side JWT guard to prevent unauthorized access at the Next.js layer before any API calls.
- **Product images via file upload, not URL** — more realistic UX, and it exercises the Multer pipeline. Admin form has drag-and-drop with preview.
- **`/auth/me` endpoint for server-side admin guard** — the admin Next.js layout reads the `access_token` cookie server-side and calls the backend to verify it. This keeps auth logic on the backend rather than trusting JWT verification in Next.js middleware.

---

## Trade-offs and Scope

### What was built fully

- All 6 storefront features: catalog (search + filter by category + price range + sort + paginate), product detail, cart (persistent, per-user, quantity controls), checkout (address capture + mock payment + order creation), order history, auth (JWT httpOnly cookies, refresh tokens).
- All 4 admin panel features: product CRUD with image upload, order management with status transitions, analytics dashboard with bar chart, access control (server-side + API layer).
- Open-ended recommendation feature.
- Seed script, README, NOTES.md, unit tests.

### What was mocked or simplified

- **Payment**: mock service always succeeds. A real Stripe integration would add webhook handling and idempotency keys.
- **Email notifications**: none. Order confirmation is shown in-app only. Production would add transactional email (SendGrid/Resend) on order creation.
- **Image storage**: local disk (`backend/uploads/`). Production would use S3/Cloudinary. The upload module is structured to make this swap easy — just replace the `multer` destination with an S3 stream.
- **Search**: MongoDB `$text` index search — works for the scale of this assessment. Production at scale would use Elasticsearch or MongoDB Atlas Search for relevance ranking.
- **Rate limiting**: not implemented on auth endpoints. Production would add `@nestjs/throttler`.
- **E2E tests**: the existing e2e test file (`test/app.e2e-spec.ts`) is the NestJS boilerplate. A full e2e suite covering the checkout journey would be the next test investment.

### What I'd do with more time

1. Full Stripe test-mode integration (not just a mock).
2. Real e2e tests: register → add to cart → checkout → order confirmed → admin updates status.
3. Email order confirmation.
4. Elasticsearch for full-text product search with relevance scoring.
5. Collaborative filtering for recommendations (users who bought X also bought Y).
6. Storybook for the component library.
7. Production deployment config (Docker Compose, environment-specific builds, health checks).

---

## Agent Session Transcripts

Claude Code session transcripts are stored at:
```
C:\Users\orcalo\.claude\projects\d--ecommerce\
```

Each session produces a `.jsonl` file with every tool call, result, and model response.
The main build session ID: `d21a9d49-5eb5-47bb-98cd-836417cc982b`
