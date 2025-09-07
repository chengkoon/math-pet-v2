import { create } from 'zustand';

interface AppState {
  count: number;
  name: string;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setName: (name: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  name: 'World',
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setName: (name) => set({ name }),
}));
