'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useInitializeAuth } from '@/hooks/use-auth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

// Define routes that require authentication check
const protectedRoutes = [
  '/home',
  '/practice',
  '/test',
  '/packs',
  '/profile',
  '/settings',
];

// Define public routes that should never call /auth/me
const publicRoutes = ['/', '/login', '/register', '/forgot-password'];

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const pathname = usePathname();
  const initAuth = useInitializeAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only initialize auth if we're not on a public route
    const isPublicRoute = publicRoutes.some(
      (route) =>
        pathname === route || (route !== '/' && pathname.startsWith(route))
    );

    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );

    // Initialize authentication only on protected routes or routes that might need auth
    if (!hasInitialized.current && !isPublicRoute && isProtectedRoute) {
      initAuth.mutate();
      hasInitialized.current = true;
    }
  }, [pathname, initAuth]); // Include pathname to re-evaluate on route changes

  return <>{children}</>;
};
