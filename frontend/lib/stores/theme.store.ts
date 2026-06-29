'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      primaryColor: '#F57224',
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
    }),
    { name: 'shopforge-theme' },
  ),
);
