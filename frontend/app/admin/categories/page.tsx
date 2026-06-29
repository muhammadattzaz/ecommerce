'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/products';
import { ApiError } from '@/lib/api/client';
import type { Category } from '@/types/product';

interface CategoryFormState {
  name: string;
  description: string;
  isActive: boolean;
}

const EMPTY_FORM: CategoryFormState = { name: '', description: '', isActive: true };

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', 'admin'],
    queryFn: categoriesApi.getAllAdmin,
    staleTime: 1000 * 60 * 2,
  });

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormState) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCreating(false);
      setForm(EMPTY_FORM);
      setFormError('');
    },
    onError: (err) => setFormError(err instanceof ApiError ? err.message : 'Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormState }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setForm(EMPTY_FORM);
      setFormError('');
    },
    onError: (err) => setFormError(err instanceof ApiError ? err.message : 'Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  function startEdit(cat: Category) {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description ?? '', isActive: cat.isActive });
    setCreating(false);
    setFormError('');
  }

  function cancelForm() {
    setCreating(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const catList = (categories ?? []) as Category[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-gray-900">Categories</h1>
        {!creating && !editingId && (
          <button
            onClick={() => { setCreating(true); setEditingId(null); setForm(EMPTY_FORM); setFormError(''); }}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-[4px] transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}
          >
            <Plus size={15} />
            New Category
          </button>
        )}
      </div>

      {/* Create / Edit form */}
      {(creating || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8E8E8] rounded-[4px] p-5 space-y-4"
        >
          <h2 className="text-[14px] font-bold text-gray-900">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Name *</label>
            <input
              required
              autoFocus
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full h-9 px-3 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224]"
              placeholder="e.g. Electronics"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E8E8E8] rounded-[4px] text-[13px] outline-none focus:border-[#F57224] resize-none"
              placeholder="Short description (optional)"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-[#F57224]"
            />
            <span className="text-[13px] text-gray-700">Active (visible in store)</span>
          </label>

          {formError && (
            <p className="text-[12px] text-[#D0021B] bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-[4px] disabled:opacity-70"
              style={{ background: 'var(--color-primary)' }}
            >
              <Check size={14} />
              {isSaving ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-gray-600 border border-[#E8E8E8] rounded-[4px] hover:border-gray-400"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Category list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-[4px] animate-pulse" />
          ))}
        </div>
      ) : catList.length === 0 ? (
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] py-16 text-center">
          <Tag size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-[14px] font-medium text-gray-500">No categories yet</p>
          <p className="text-[12px] text-gray-400 mt-1">Create your first category above</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E8E8] rounded-[4px] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#F5F5F5] bg-gray-50">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {catList.map((cat) => (
                <tr key={cat._id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-[200px] truncate">
                    {cat.description || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"? This cannot be undone.`)) {
                            deleteMutation.mutate(cat._id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-[#D0021B] transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
