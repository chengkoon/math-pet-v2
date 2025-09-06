import { create } from 'zustand';

interface AppState {
  count: number;
  name: string;
  theme: 'light' | 'dark';
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setName: (name: string) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  name: 'World',
  theme: 'light',
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setName: (name) => set({ name }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));
