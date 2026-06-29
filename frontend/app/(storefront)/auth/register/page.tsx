'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { ROUTES } from '@/lib/routes';
import { ApiError } from '@/lib/api/client';

export default function RegisterPage() {
  const router = useRouter();
  const { register, registerPending } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password });
      router.push(ROUTES.HOME);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-[#E8E8E8] rounded-[4px] p-8 shadow-sm">
        <h1 className="text-[22px] font-bold text-gray-900 mb-1">Create account</h1>
        <p className="text-[13px] text-gray-500 mb-6">Join ShopForge today — it&apos;s free</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 border border-[#E8E8E8] rounded-[4px] text-[14px] outline-none focus:border-[#F57224]"
              placeholder="Min. 8 characters"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Must include uppercase, lowercase, number, and special character (@$!%*?&amp;)
            </p>
          </div>

          {error && (
            <p className="text-[12px] text-[#D0021B] bg-red-50 border border-red-200 rounded-[4px] px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={registerPending}
            className="w-full h-10 text-[14px] font-semibold text-white rounded-[4px] transition-colors disabled:opacity-70"
            style={{ background: 'var(--color-primary)' }}
          >
            {registerPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] text-gray-500">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="font-medium text-[#F57224] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
