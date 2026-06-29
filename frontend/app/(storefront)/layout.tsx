import Link from 'next/link';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
            ShopForge
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
            <Link href="/products" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Products
            </Link>
            <Link href="/cart" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Cart
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        © {new Date().getFullYear()} ShopForge. All rights reserved.
      </footer>
    </div>
  );
}
