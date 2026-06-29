'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { ROUTES } from '@/lib/routes';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Pre-fill once user loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Redirect unauthenticated visitors
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const updated = await authApi.updateProfile({
        name: name !== user?.name ? name : undefined,
        email: email !== user?.email ? email : undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      // Refresh the auth cache so navbar name updates immediately
      queryClient.setQueryData(['auth', 'me'], updated);
      setSuccess('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-10">
      <h1 className="text-[22px] font-bold text-gray-900 mb-1">My Profile</h1>
      <p className="text-[13px] text-gray-500 mb-8">Update your name, email, or password</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Account info ─────────────────────────────────── */}
        <section className="bg-white border border-[#E8E8E8] rounded-[4px] p-6">
          <h2 className="text-[14px] font-semibold text-gray-800 mb-4">Account information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
              />
            </div>
          </div>
        </section>

        {/* ── Change password ───────────────────────────────── */}
        <section className="bg-white border border-[#E8E8E8] rounded-[4px] p-6">
          <h2 className="text-[14px] font-semibold text-gray-800 mb-1">Change password</h2>
          <p className="text-[12px] text-gray-500 mb-4">Leave blank to keep your current password</p>

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
                placeholder="Required to change password"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
                placeholder="Min. 8 characters"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Must include uppercase, lowercase, number, and special character (@$!%*?&amp;)
              </p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
                placeholder="Re-enter new password"
              />
            </div>
          </div>
        </section>

        {/* ── Feedback messages ─────────────────────────────── */}
        {error && (
          <p className="text-[12px] text-[#D0021B] bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-[12px] text-green-700 bg-green-50 border border-green-200 rounded-[4px] px-3 py-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full h-10 text-[14px] font-semibold text-white rounded-[4px] transition-colors disabled:opacity-70"
          style={{ background: 'var(--color-primary)' }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
