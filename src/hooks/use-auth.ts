import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
import type { LoginRequest, UserResponse } from '@chengkoon/mathpet-api-types';

interface UseLoginOptions {
  onSuccess?: (data: UserResponse) => void;
  onError?: (error: unknown) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAppStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data: UserResponse) => {
      console.log('Login successful:', data);
      // Store user data and authentication state
      setUser({
        userId: data.userId,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        levelId: data.levelId || undefined,
      });
      setIsAuthenticated(true);

      // No need to handle JWT tokens - authentication is now cookie-based

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Call custom success handler
      options?.onSuccess?.(data);

      // Redirect to dashboard or return path
      const returnTo =
        new URLSearchParams(window.location.search).get('from') || '/home';
      router.push(returnTo);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      options?.onError?.(error);
    },
  });
};

interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

// Hook for checking authentication status on app load
export const useInitializeAuth = () => {
  const { setUser, setIsAuthenticated } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      try {
        const userData = await authService.getMe();
        return userData;
      } catch {
        // If the request fails (e.g., 401), it means user is not authenticated
        // We don't throw here to allow graceful handling
        return null;
      }
    },
    onSuccess: (data) => {
      if (data) {
        // User is authenticated, update store
        setUser({
          userId: data.userId,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          levelId: data.levelId || undefined,
        });
        setIsAuthenticated(true);
        console.log('Authentication restored from session:', data);
      } else {
        // No valid session, ensure user is logged out
        setUser(null);
        setIsAuthenticated(false);
      }
    },
    onError: (error) => {
      console.log('No active session found:', error);
      // Ensure user is logged out on error
      setUser(null);
      setIsAuthenticated(false);
    },
  });
};

export const useLogout = (options?: UseLogoutOptions) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      // Call the backend logout endpoint to clear the session cookie
      await authService.logout();
    },
    onSuccess: () => {
      // Clear user data and authentication state
      logout();

      // Clear all cached queries
      queryClient.clear();

      // Call custom success handler
      options?.onSuccess?.();

      // Redirect to landing page with success toast
      toast.success('Logged out successfully');
      router.push('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails on backend, clear local state
      logout();
      queryClient.clear();

      options?.onError?.(error);
      toast.error('Logout failed, but you have been signed out locally');
      router.push('/');
    },
  });
};
