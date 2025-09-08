"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Menu,
  X,
  Home,
  BookOpen,
  Package,
  TestTube,
  User,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from '@/store/use-app-store';
import { useLogout } from '@/hooks/use-auth';

// Types for component props
interface TopNavProps {
  className?: string;
}


interface ThemeToggleProps {
  className?: string;
}

interface NotificationBellProps {
  className?: string;
  count?: number;
}

// Mock user data - replace with actual user data from your store
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null, // URL or null for initials
};

// User avatar component

// Navigation items for mobile menu
const navigationItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/test', label: 'Test', icon: TestTube },
];

// Theme toggle component
function ThemeToggle({ className }: ThemeToggleProps) {

  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    const themes: ['light', 'dark', 'system'] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf((theme as 'light' | 'dark' | 'system') ?? 'system');
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme as 'light' | 'dark' | 'system');
    // TODO: Integrate with next-themes
    // This is where you'd call your theme provider's setTheme function
    console.log('Theme changed to:', nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      className={className}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
    >
      {getThemeIcon()}
    </Button>
  );
}

// Notification bell component
function NotificationBell({ className, count = 0 }: NotificationBellProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <Bell className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Button>
  );
}

// Refactored user menu dropdown using shadcn/ui primitives
function UserMenu() {
  const router = useRouter();
  const { user } = useAppStore();
  const logoutMutation = useLogout();
  const userData = user;

  const handleNavigation = (href: string) => {
    router.push(href as unknown as Parameters<typeof router.push>[0]);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mockUser.avatar || undefined} alt={mockUser.name} />
            <AvatarFallback>
              {mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData && userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : mockUser.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email || mockUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Main top navigation component
export function DashboardTopNav({ className }: TopNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // ...existing code...
  const pathname = usePathname();
  const router = useRouter();

  const handleMobileNavigation = (href: string) => {
    router.push(href as unknown as Parameters<typeof router.push>[0]);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                MathPet
              </h1>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    onClick={() => router.push(item.href as unknown as Parameters<typeof router.push>[0])}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Right side - Actions and user menu */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <ThemeToggle className="hidden sm:block" />
            
            {/* Notifications */}
            <NotificationBell count={3} className="hidden sm:block" />

            {/* User menu */}
            <div className="relative flex items-center">
              <UserMenu />
              {/* <span className="hidden sm:block ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {mockUser.name}
              </span> */}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    onClick={() => handleMobileNavigation(item.href)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
            
            {/* Mobile actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme & Notifications
                </span>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <NotificationBell count={3} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}