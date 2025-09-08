'use client';

import { LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  variant?: 'button' | 'menu-item';
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({ 
  variant = 'button', 
  className = '',
  children 
}: LogoutButtonProps) {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isLoading = logoutMutation.isPending;

  if (variant === 'menu-item') {
    return (
        <Button
          type="button"
          onClick={handleLogout}
          variant="ghost"
          disabled={isLoading}
          className={`flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 ${className}`}
        >
        <LogOut className="mr-2 h-4 w-4" />
        {children || (isLoading ? 'Logging out...' : 'Logout')}
        </Button>
    );
  }

  return (
      <Button
        type="button"
        onClick={handleLogout}
        variant="ghost"
        disabled={isLoading}
        className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 ${className}`}
      >
      {isLoading ? (
        <>
          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          {children || 'Logout'}
        </>
      )}
      </Button>
  );
}