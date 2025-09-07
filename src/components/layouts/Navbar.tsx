'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  X,
  Brain,
  LogOut,
  Home,
  BookOpen,
  Check,
  Star,
  Settings,
  FileText,
} from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, checkIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
    setShowDropdown(false);
  };

  const handleCheckIn = () => {
    checkIn();
    setIsOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Brain className="h-8 w-8 text-teal-600 group-hover:text-teal-700 transition-colors" />
              <span className="ml-2 text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                MathPet
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link
                  href="/home"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/home')
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="inline-block mr-1 h-4 w-4" /> Home
                </Link>
                <Link
                  href="/practice"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/practice')
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="inline-block mr-1 h-4 w-4" /> Practice
                </Link>
                <Link
                  href="/test"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/test')
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="inline-block mr-1 h-4 w-4" /> Test
                </Link>
                <button
                  onClick={handleCheckIn}
                  className="px-3 py-2 rounded-md text-sm font-medium text-teal-600 hover:bg-teal-50 flex items-center transition-colors"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Daily Check-in
                </button>

                {/* Profile and Stars */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center bg-gray-50 rounded-full pl-3 pr-2 py-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center mr-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {user.stars || 0}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {user ? (
              <>
                <Link
                  href="/home"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/home')
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                  onClick={handleNavClick}
                >
                  <Home className="inline-block mr-2 h-5 w-5" /> Home
                </Link>
                <Link
                  href="/practice"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/practice')
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                  onClick={handleNavClick}
                >
                  <BookOpen className="inline-block mr-2 h-5 w-5" /> Practice
                </Link>
                <Link
                  href="/test"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/test')
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                  onClick={handleNavClick}
                >
                  <FileText className="inline-block mr-2 h-5 w-5" /> Test
                </Link>
                <button
                  onClick={handleCheckIn}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-teal-600 hover:bg-teal-50 flex items-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Daily Check-in
                </button>
                <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700 text-center"
                onClick={handleNavClick}
              >
                Get Started
              </Link>
            )}
          </div>

          {/* User info for mobile */}
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user.email}
                  </div>
                </div>
                <div className="ml-auto bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200 flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium text-yellow-700">
                    {user.stars || 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};