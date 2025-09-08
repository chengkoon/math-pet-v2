"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
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
function UserAvatar({ avatar, name, size = 40 }: { avatar: string | null, name: string, size?: number }) {
  return (
    <div
      className={`bg-blue-500 rounded-full flex items-center justify-center text-white font-medium`}
      style={{ width: size, height: size }}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
      ) : (
        name.split(' ').map(n => n[0]).join('').toUpperCase()
      )}
    </div>
  );
}

// Navigation items for mobile menu
const navigationItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/pack', label: 'Packs', icon: Package },
  { href: '/test', label: 'Test', icon: TestTube },
];

// Theme toggle component
function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handleThemeChange = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length] as 'light' | 'dark' | 'system';
    setTheme(nextTheme);
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
    <button
      className={`relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <Bell className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

// User menu dropdown
function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const router = useRouter();
  const { user } = useAppStore();
  const logoutMutation = useLogout();

  const handleNavigation = (href: string) => {
    router.push(href as unknown as Parameters<typeof router.push>[0]);
    onClose();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  const userData = user;

  if (!isOpen) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mockUser.avatar || undefined} alt={mockUser.name} />
            <AvatarFallback>
              {mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
                  <button
                    key={item.href}
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
                  </button>
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
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <UserAvatar avatar={mockUser.avatar} name={mockUser.name} size={32} />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mockUser.name}
                </span>
              </button>

              <UserMenu
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
              />
            </div>

            {/* Mobile menu button */}
            <button
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
            </button>
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
                  <button
                    key={item.href}
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
                  </button>
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