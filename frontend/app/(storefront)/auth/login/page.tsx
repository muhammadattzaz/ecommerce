'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { ROUTES } from '@/lib/routes';
import { ApiError } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginPending } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const user = await login({ email, password });
      router.push(user.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-[#E8E8E8] rounded-[4px] p-8 shadow-sm">
        <h1 className="text-[22px] font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-[13px] text-gray-500 mb-6">Welcome back to ShopForge</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
              style={{ boxShadow: 'none' }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[12px] text-[#D0021B] bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loginPending}
            className="w-full h-10 text-[14px] font-semibold text-white rounded-[4px] transition-colors disabled:opacity-70"
            style={{ background: 'var(--color-primary)' }}
          >
            {loginPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] text-gray-500">
          No account?{' '}
          <Link href={ROUTES.REGISTER} className="font-medium text-[#F57224] hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
