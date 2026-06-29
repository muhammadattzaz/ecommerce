'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useCategories, useUpdateProduct } from '@/lib/hooks/use-products';
import { productsApi } from '@/lib/api/products';
import { useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import type { Category, Product } from '@/types/product';
import { ApiError } from '@/lib/api/client';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: categories } = useCategories();
  const updateProduct = useUpdateProduct();

  const { data: product, isLoading } = useQuery({
    queryKey: ['products', 'id', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });

  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      const cat = product.category as Category | string;
      setForm({
        name: product.name,
        description: product.description ?? '',
        price: (product.price / 100).toFixed(2),
        stock: String(product.stock),
        category: typeof cat === 'object' ? cat._id : cat,
        isActive: product.isActive,
      });
    }
  }, [product]);

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await updateProduct.mutateAsync({
        id,
        data: {
          name: form.name,
          description: form.description,
          price: Math.round(parseFloat(form.price) * 100),
          stock: parseInt(form.stock),
          category: form.category,
          isActive: form.isActive,
        } as Partial<Product>,
      });
      router.push(ROUTES.ADMIN.PRODUCTS);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update product');
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-[600px] space-y-3">
        <div className="sf-shimmer h-8 w-48 rounded" />
        <div className="sf-shimmer h-64 rounded-[4px]" />
      </div>
    );
  }

  return (
    <div className="max-w-[600px]">
      <nav className="flex items-center gap-1 text-[12px] mb-4">
        <Link href={ROUTES.ADMIN.PRODUCTS} className="text-[#F57224] hover:underline">Products</Link>
        <ChevronRight size={12} className="text-gray-400" />
        <span className="text-gray-500 truncate max-w-[180px]">{product?.name ?? id}</span>
      </nav>

      <h1 className="text-[20px] font-bold text-gray-900 mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E8E8E8] rounded-[4px] p-5 space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-gray-700 mb-1">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Price (£) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Stock *</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
              className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-gray-700 mb-1">Category *</label>
          <select
            required
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224] bg-white"
          >
            <option value="">Select category…</option>
            {(categories as Category[] ?? []).map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
            className="w-4 h-4 accent-[#F57224]"
          />
          <span className="text-[13px] text-gray-700">Active (visible in store)</span>
        </label>

        {error && (
          <p className="text-[12px] text-[#D0021B] bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={updateProduct.isPending}
            className="px-5 py-2.5 text-[13px] font-semibold text-white rounded-[4px] disabled:opacity-70"
            style={{ background: 'var(--color-primary)' }}
          >
            {updateProduct.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          <Link
            href={ROUTES.ADMIN.PRODUCTS}
            className="px-4 py-2.5 text-[13px] font-medium text-gray-600 border border-[#E8E8E8] rounded-[4px] hover:border-gray-400"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
