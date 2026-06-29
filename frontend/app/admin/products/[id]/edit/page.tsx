'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Upload, X } from 'lucide-react';
import { useCategories, useUpdateProduct } from '@/lib/hooks/use-products';
import { productsApi } from '@/lib/api/products';
import { uploadImage } from '@/lib/api/upload';
import { useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { getImageUrl } from '@/lib/utils';
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImageUrl(product.imageUrl ?? null);
    }
  }, [product]);

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
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
          imageUrl: imageUrl ?? undefined,
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

  const previewSrc = imageUrl ? getImageUrl(imageUrl) : null;

  return (
    <div className="max-w-[600px]">
      <nav className="flex items-center gap-1 text-[12px] mb-4">
        <Link href={ROUTES.ADMIN.PRODUCTS} className="text-[#F57224] hover:underline">Products</Link>
        <ChevronRight size={12} className="text-gray-400" />
        <span className="text-gray-500 truncate max-w-[180px]">{product?.name ?? id}</span>
      </nav>

      <h1 className="text-[20px] font-bold text-gray-900 mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E8E8E8] rounded-[4px] p-5 space-y-4">

        {/* Image uploader */}
        <div>
          <label className="block text-[12px] font-medium text-gray-700 mb-1">Product Image</label>
          {previewSrc ? (
            <div className="relative w-24 h-24 rounded-[4px] overflow-hidden border border-[#E8E8E8]">
              <Image src={previewSrc} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className="flex flex-col items-center justify-center gap-1.5 h-24 border-2 border-dashed rounded-[4px] cursor-pointer transition-colors"
              style={{
                borderColor: dragOver ? '#F57224' : '#E8E8E8',
                background: dragOver ? 'rgba(245,114,36,0.04)' : '#FAFAFA',
              }}
            >
              {uploading ? (
                <span className="text-[12px] text-gray-400">Uploading…</span>
              ) : (
                <>
                  <Upload size={20} className="text-gray-300" />
                  <span className="text-[12px] text-gray-400">Click or drag to replace image</span>
                  <span className="text-[11px] text-gray-300">JPEG · PNG · WebP · max 5 MB</span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>

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
            disabled={updateProduct.isPending || uploading}
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
