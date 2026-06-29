import { apiClient } from './client';
import type { User } from '@/types/user';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<User>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<User>('/auth/login', data),

  logout: () => apiClient.post<void>('/auth/logout'),

  refresh: () => apiClient.post<void>('/auth/refresh'),

  getMe: () => apiClient.get<User>('/auth/me'),
};
