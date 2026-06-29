import { apiClient } from './client';
import type { User } from '@/types/user';

export const authApi = {
  register: async (data: { name: string; email: string; password: string }): Promise<User> => {
    // Backend returns { user: UserDocument } — unwrap it
    const res = await apiClient.post<{ user: User }>('/auth/register', data);
    return res.user;
  },

  login: async (data: { email: string; password: string }): Promise<User> => {
    // Backend returns { user: UserDocument } — unwrap it
    const res = await apiClient.post<{ user: User }>('/auth/login', data);
    return res.user;
  },

  logout: () => apiClient.post<void>('/auth/logout'),

  refresh: () => apiClient.post<void>('/auth/refresh'),

  getMe: () => apiClient.get<User>('/auth/me'),

  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }): Promise<User> =>
    apiClient.patch<User>('/auth/me', data),
};
