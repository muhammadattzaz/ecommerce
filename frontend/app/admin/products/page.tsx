'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/lib/hooks/use-products';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading } = useProducts({ page, limit: 20, search: search || undefined });
  const deleteProduct = useDeleteProduct();

  async function handleDelete(id: string) {
    await deleteProduct.mutateAsync(id);
    setConfirmDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[20px] font-bold text-gray-900">Products</h1>
        <Link
          href={ROUTES.ADMIN.NEW_PRODUCT}
          className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-[4px] transition-colors"
          style={{ background: 'var(--color-primary)' }}
        >
          <Plus size={15} />
          New Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E8E8E8] rounded-[4px] p-3 mb-3">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-xs h-8 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E8E8] rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Price</th>
                <th className="text-right px-4 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Stock</th>
                <th className="text-center px-4 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Active</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F5F5]">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="sf-shimmer h-4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                data?.data.map((product: Product) => {
                  const cat = product.category as { name: string } | null;
                  return (
                    <tr key={product._id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-4 py-2.5 font-medium text-gray-800 max-w-[200px] truncate">
                        {product.name}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 hidden md:table-cell">
                        {cat?.name ?? '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium">
                        {formatPrice(product.price)}
                      </td>
                      <td className={`px-4 py-2.5 text-right hidden sm:table-cell ${product.stock < 5 ? 'text-[#D0021B] font-semibold' : 'text-gray-600'}`}>
                        {product.stock}
                      </td>
                      <td className="px-4 py-2.5 text-center hidden sm:table-cell">
                        <span className={`w-2 h-2 rounded-full inline-block ${product.isActive ? 'bg-[#00B775]' : 'bg-gray-300'}`} />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={ROUTES.ADMIN.EDIT_PRODUCT(product._id)}
                            className="p-1.5 text-gray-400 hover:text-[#F57224] transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </Link>
                          {confirmDelete === product._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-[11px] text-white bg-[#D0021B] px-2 py-0.5 rounded"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-[11px] text-gray-500 px-1"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(product._id)}
                              className="p-1.5 text-gray-400 hover:text-[#D0021B] transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E8E8]">
            <p className="text-[12px] text-gray-500">
              {data.total} products · Page {page} of {data.totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-[12px] px-3 py-1 text-[#F57224] disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-[12px] px-3 py-1 text-[#F57224] disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
