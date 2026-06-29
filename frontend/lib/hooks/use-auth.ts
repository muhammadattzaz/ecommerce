'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useEffect } from 'react';

export function useAuth() {
  const { user, setUser, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setUser(data ?? null);
    setLoading(isLoading);
  }, [data, isLoading, setUser, setLoading]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });

  return {
    user: data ?? user,
    isLoading,
    isAuthenticated: !!(data ?? user),
    isAdmin: (data ?? user)?.role === 'admin',
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    loginPending: loginMutation.isPending,
    registerPending: registerMutation.isPending,
  };
}
