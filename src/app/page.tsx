'use client';

import { useAppStore } from '@/store/use-app-store';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function HomePage() {
  const {
    user
  } = useAppStore();

  return (
    <div className="app-bg min-h-screen text-gray-900 transition-colors duration-300 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
            Hello, {user?.firstName}!
          </h1>
          <p className="mb-8 text-xl opacity-70">
            Welcome to your Next.js app with Zustand state management
          </p>

          {/* Theme Switcher */}
          <div className="mb-8">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Name Input */}
        <div className="mx-auto mb-12 max-w-md">
          <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
            Change your name:
          </label>
          <input
            type="text"
            value={user?.firstName || ''}
            readOnly
            // onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, next-themes, Zustand, Tailwind CSS & Lucide Icons</p>
        </div>
      </div>
    </div>
  );
}
