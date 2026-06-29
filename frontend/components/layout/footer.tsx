import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Electronics', href: '/products?category=electronics' },
      { label: 'Clothing', href: '/products?category=clothing' },
      { label: 'Books', href: '/products?category=books' },
      { label: 'Home & Garden', href: '/products?category=home-garden' },
      { label: 'Sports', href: '/products?category=sports' },
    ],
  },
  {
    title: 'My Account',
    links: [
      { label: 'Sign In', href: '/auth/login' },
      { label: 'Create Account', href: '/auth/register' },
      { label: 'Order History', href: '/orders' },
      { label: 'Shopping Cart', href: '/cart' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Customer Service', href: '#' },
      { label: 'Track Your Order', href: '/orders' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'FAQs', href: '#' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'About ShopForge', href: '#' },
      { label: 'Sell on ShopForge', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white" style={{ borderTop: '1px solid var(--color-border)' }}>
      {/* Main grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-[13px] font-bold text-gray-900 mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-gray-500 hover:text-[#F57224] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="bg-[#F5F5F5]"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="text-[12px] text-gray-400">
            © {new Date().getFullYear()} ShopForge. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-400">
            Secure payments · Fast delivery · Easy returns
          </p>
        </div>
      </div>
    </footer>
  );
}
