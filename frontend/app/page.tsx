import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold tracking-tight text-indigo-600">ShopForge</span>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/products" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Products
            </Link>
            <Link href="/auth/login" className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-opacity hover:opacity-90">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Welcome to{' '}
              <span className="text-indigo-600">ShopForge</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Premium products. Seamless shopping. Delivered to your door.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/products"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Shop Now
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Categories placeholder */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'].map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat.toLowerCase()}`}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-sm font-medium text-gray-700 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                { title: 'Free Shipping', desc: 'On all orders over £50' },
                { title: 'Secure Payment', desc: 'Your data is safe with us' },
                { title: 'Easy Returns', desc: '30-day return policy' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-950">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        © {new Date().getFullYear()} ShopForge. All rights reserved.
      </footer>
    </div>
  );
}
