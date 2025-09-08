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
      // Store user data and authentication state
      setUser({
        userId: data.userId,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });
      setIsAuthenticated(true);

      // Store JWT token in cookie or localStorage
      if (data.token) {
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Call custom success handler
      options?.onSuccess?.(data);

      // Redirect to dashboard or return path
      const returnTo = new URLSearchParams(window.location.search).get('from') || '/home';
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

export const useLogout = (options?: UseLogoutOptions) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      // Clear the auth token from cookies
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
      
      // Clear any other auth-related cookies if they exist
      document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
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
      options?.onError?.(error);
    },
  });
};
