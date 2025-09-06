'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppStore();

  useEffect(() => {
    // Apply or remove the 'dark' class on the html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
