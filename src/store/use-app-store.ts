import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface User {
  userId: string | undefined;
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  role: string | undefined;
  levelId: number | undefined;
}

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;

  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';

  // Actions
  setIsAuthenticated: (isAuth: boolean) => void;
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isAuthenticated: false,
        user: null,
        sidebarOpen: false,
        theme: 'system',

        // Actions
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setUser: (user) => set({ user }),
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
        logout: () => set({ isAuthenticated: false, user: null }),
      }),
      {
        name: 'mathpet-store',
        partialize: (state) => ({
          theme: state.theme,
          // Don't persist auth state for security
        }),
      }
    )
  )
);
