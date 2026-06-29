import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerUser } from '@/lib/server/get-server-user';
import { ROUTES } from '@/lib/routes';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 shrink-0 min-h-screen"
        style={{ background: '#1A1A2E' }}
      >
        <div className="p-4 border-b border-white/10">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-[16px] font-black text-white tracking-tight">ShopForge</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
              style={{ background: 'var(--color-primary)', color: '#fff' }}>
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { href: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard' },
            { href: ROUTES.ADMIN.PRODUCTS, label: 'Products' },
            { href: ROUTES.ADMIN.CATEGORIES, label: 'Categories' },
            { href: ROUTES.ADMIN.ORDERS, label: 'Orders' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="sf-sidebar-item block px-3 py-2 rounded-[4px] text-[13px] font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <p className="text-[11px] text-white/40 truncate">{user.email}</p>
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1.5 mt-2 text-[12px] font-medium text-white/60 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 border-b border-white/10"
        style={{ background: '#1A1A2E' }}>
        <span className="text-[15px] font-black text-white">ShopForge Admin</span>
        <div className="flex items-center gap-3 text-[12px] text-white/70">
          <Link href={ROUTES.ADMIN.DASHBOARD} className="hover:text-white">Dashboard</Link>
          <Link href={ROUTES.ADMIN.PRODUCTS} className="hover:text-white">Products</Link>
          <Link href={ROUTES.ADMIN.CATEGORIES} className="hover:text-white">Categories</Link>
          <Link href={ROUTES.ADMIN.ORDERS} className="hover:text-white">Orders</Link>
          <Link href={ROUTES.HOME} className="hover:text-white text-white/40">← Store</Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:p-6 p-4 pt-16 lg:pt-6">
        {children}
      </main>
    </div>
  );
}
