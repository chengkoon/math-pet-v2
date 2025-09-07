// @/hooks/useAuth.ts
// Alternative standalone hook if you prefer not to use the AuthProvider pattern

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User interface - adjust based on your actual user type from @chengkoon/mathpet-api-types
interface User {
  id: string;
  name: string;
  email: string;
  stars: number;
  petLevel?: number;
  token?: string;
  role?: 'student' | 'teacher' | 'parent';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkIn: () => void;
  updateStars: (stars: number) => void;
}

// Zustand store for auth state with persistence
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // TODO: Replace with actual API call using @chengkoon/mathpet-api-types
          // Example:
          // import { authApi } from '@/utils/api';
          // const response = await authApi.login({ email, password });
          // const user = response.data;
          
          // Mock login for development
          const mockUser: User = {
            id: '1',
            name: email.split('@')[0], // Use email prefix as name
            email: email,
            stars: 150,
            petLevel: 3,
            token: 'mock-jwt-token',
            role: 'student'
          };
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Invalid email or password');
        }
      },

      logout: () => {
        // TODO: Call logout API if needed
        // await authApi.logout();
        
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      checkIn: () => {
        const { user } = get();
        if (user) {
          // TODO: Call check-in API
          // await userApi.checkIn();
          
          const updatedUser = {
            ...user,
            stars: user.stars + 10 // Daily check-in bonus
          };
          set({ user: updatedUser });
        }
      },

      updateStars: (stars: number) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, stars } 
          });
        }
      },
    }),
    {
      name: 'mathpet-auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);