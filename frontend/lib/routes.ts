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
    ORDER: (id: string) => `/admin/orders/${id}`,
  },
} as const;
