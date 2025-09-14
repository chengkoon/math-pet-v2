'use client';

import { useEffect, useRef } from 'react';
import { useInitializeAuth } from '@/hooks/use-auth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const initAuth = useInitializeAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Initialize authentication on app load - only once
    if (!hasInitialized.current) {
      initAuth.mutate();
      hasInitialized.current = true;
    }
  }); // No dependencies - we control execution with the ref

  return <>{children}</>;
};
