# Frontend Rules — ShopForge (`frontend/`)

## Stack
Next.js 14 (App Router) · TypeScript 5 · Tailwind CSS · Zustand · TanStack Query v5
Framer Motion · next-themes · React Hook Form · Zod · Recharts · Node 25

---

## Next.js App Router Patterns

### Server vs Client Components
- Server components are the default — no `'use client'` unless required
- Add `'use client'` only for: event handlers, hooks, browser APIs, Framer Motion
- Never import Zustand stores in server components

```typescript
// Server component — default, no directive needed
export default async function ProductsPage() {
  const products = await api.products.getAll({ page: 1 });
  return <ProductGrid products={products.data} />;
}

// Client component — needs interactivity
'use client';
export function AddToCartButton({ productId }: { productId: string }) {
  const addItem = useCartStore((s) => s.addItem);
  return <button onClick={() => addItem(productId)}>Add to Cart</button>;
}
```

### Route Groups
```
app/
├── (storefront)/        ← public routes, storefront layout
│   ├── layout.tsx       ← Navbar + Footer
│   └── products/page.tsx
└── admin/               ← protected, admin layout
    ├── layout.tsx       ← server-side auth check here
    └── page.tsx
```

### Admin Layout — Server-Side Auth Guard
```typescript
// app/admin/layout.tsx — always server component
export default async function AdminLayout({ children }) {
  const user = await getServerUser(); // reads cookie server-side
  if (!user || user.role !== 'admin') redirect('/auth/login');
  return <AdminShell>{children}</AdminShell>;
}
```

### Route Constants
```typescript
// lib/routes.ts — never hardcode route strings
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER: (id: string) => `/orders/${id}`,
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    NEW_PRODUCT: '/admin/products/new',
    EDIT_PRODUCT: (id: string) => `/admin/products/${id}/edit`,
    ORDERS: '/admin/orders',
  },
} as const;
```

---

## Component Patterns

### Explicit Prop Interfaces
```typescript
// Always define props as an interface — never inline
interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, className, onAddToCart }: ProductCardProps) {}
```

### Base UI Components (`components/ui/`)
- No business logic — purely presentational
- Accept `className` prop for extension
- Use `cn()` utility for conditional classes (clsx + tailwind-merge)

```typescript
import { cn } from '@/lib/utils';

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-[var(--radius)] px-4 py-2 font-medium text-sm transition-all',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-primary text-white hover:brightness-110',
        variant === 'ghost' && 'bg-transparent hover:bg-surface-2',
        className,
      )}
      {...props}
    />
  );
}
```

---

## Data Fetching Patterns

### API Client (`lib/api/`)
```typescript
// lib/api/client.ts — base fetch with auth + error handling
async function client<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: 'include', // send httpOnly cookies
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(res.status, error.message);
  }
  return res.json();
}
```

### Hooks Wrap TanStack Query (`lib/hooks/`)
Components NEVER call `lib/api/` directly — always through a hook:
```typescript
// lib/hooks/use-products.ts
export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.products.getAll(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData, // smooth pagination
  });
}

// Mutation with cache invalidation
export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.cart.addItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}
```

### staleTime Guidelines
| Data | staleTime |
|---|---|
| Product catalog | 2 minutes |
| Product detail | 5 minutes |
| Cart | 30 seconds |
| Orders | 1 minute |
| Analytics | 5 minutes |

---

## Zustand Store Patterns (`lib/stores/`)

```typescript
// lib/stores/cart.store.ts
interface CartStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

// Client-only UI state — don't persist API data here
// Server data lives in TanStack Query cache
export const useCartStore = create<CartStore>()((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

// Granular selectors — avoid subscribing to whole store
const isOpen = useCartStore((s) => s.isOpen); // ✓
const store = useCartStore();                  // ✗ — re-renders on any change
```

---

## Form Patterns (React Hook Form + Zod)

```typescript
const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await login(data); // call mutation
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} error={errors.email?.message} />
      <Button type="submit" loading={isSubmitting}>Login</Button>
    </form>
  );
}
```

---

## Tailwind & Theme System

All semantic colors come from CSS variables — never hardcode hex:
```typescript
// tailwind.config.ts extensions
colors: {
  primary: 'hsl(var(--primary-h), var(--primary-s), var(--primary-l))',
  background: 'var(--background)',
  surface: 'var(--surface)',
  'surface-2': 'var(--surface-2)',
  border: 'var(--border)',
  text: 'var(--text)',
  'text-2': 'var(--text-2)',
}
```

### Responsive Convention (mobile-first)
```
base      → mobile
sm:       → 640px+
md:       → 768px+
lg:       → 1024px+
xl:       → 1280px+
```

Product grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
Admin sidebar: `hidden lg:flex` with mobile sheet drawer

---

## Animation Rules (Framer Motion)

```typescript
// Always guard with prefers-reduced-motion
const prefersReduced = useReducedMotion();

// Standard card entrance
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// Staggered product grid
const gridVariants = {
  visible: { transition: { staggerChildren: 0.05 } },
};

// Drawer/modal — always wrap in AnimatePresence
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
    />
  )}
</AnimatePresence>
```

---

## Image Handling

```typescript
// Always next/image — never <img>
import Image from 'next/image';

// Product images — build full URL from relative path
export function getImageUrl(path?: string): string {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '');
  return `${base}${path}`;
}

// Usage
<Image
  src={getImageUrl(product.imageUrl)}
  alt={product.name}
  width={400}
  height={400}
  className="object-cover w-full h-full"
/>
```

---

## Price Display

```typescript
// Prices are stored as integers (pence) in the API
// ALWAYS format before displaying — never show raw integers
export function formatPrice(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100);
}
// formatPrice(2999) → "£29.99"
```

---

## Code Style

- No `any` — use `unknown` or proper types
- `interface` for object shapes, `type` for unions/primitives
- kebab-case filenames: `product-card.tsx`, `use-cart.ts`
- PascalCase components: `ProductCard`, `CartDrawer`
- camelCase hooks: `useCart`, `useProducts`
- No `useEffect` for data fetching — use TanStack Query
- No hardcoded route strings — use `ROUTES` constants
- No hardcoded API URLs — use `NEXT_PUBLIC_API_URL`
- Max 300 lines per file — split at logical boundaries
