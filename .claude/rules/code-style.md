# Code Style Rules — ShopForge

Applies to both `backend/` and `frontend/`.

## TypeScript
- No `any` — use `unknown` and narrow, or define a proper interface
- `interface` for object shapes, `type` for unions and primitives
- `const` over `let`, never `var`
- `import type` for type-only imports
- Path aliases over relative traversal: `@/components/ui/button` not `../../../components/ui/button`

## Naming
| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `product-card.tsx`, `auth.service.ts` |
| Classes | PascalCase | `ProductsService`, `AuthGuard` |
| Interfaces | PascalCase, no `I` prefix | `Product`, `CartItem` |
| Functions / methods | camelCase | `findBySlug`, `addToCart` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE_MB` |
| React components | PascalCase | `ProductCard`, `CartDrawer` |
| Hooks | camelCase prefixed `use` | `useCart`, `useProducts` |
| Zustand stores | camelCase suffixed `Store` | `useCartStore`, `useAuthStore` |
| Env vars | UPPER_SNAKE_CASE | `JWT_SECRET`, `MONGODB_URI` |

## Imports Order
1. Node built-ins
2. External packages
3. Internal aliases (`@/...`)
4. Relative paths (avoid deep traversal)
5. Type imports last

## File Size
- Max 300 lines per file — split if larger
- One exported class/component per file
- Max 3 levels of nesting in logic (early return to flatten)

## Comments
- No comments explaining WHAT the code does — code should be self-documenting
- Comments only for WHY — non-obvious constraints, workarounds, business rules
- No TODO comments in committed code — use GitHub issues

## Formatting
Prettier handles formatting automatically via the `format-on-save` hook.
Do not manually format — do not add blank lines just for spacing.
