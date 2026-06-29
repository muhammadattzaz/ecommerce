'use client';

import { create } from 'zustand';

interface CartStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
}));
