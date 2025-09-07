'use client';

import { useAppStore } from '@/store/use-app-store';
import { Plus, Minus, RotateCcw, Heart } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function HomePage() {
  const {
    count,
    name,
    increment,
    decrement,
    reset,
    setName,
  } = useAppStore();

  return (
    <div className="app-bg min-h-screen text-gray-900 transition-colors duration-300 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
            Hello, {name}!
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Counter Section */}
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl transition-colors duration-300 dark:bg-gray-800">
          <div className="mb-8 text-center">
            <h2 className="mb-4 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <Heart className="text-red-500" size={24} />
              Counter Demo
            </h2>
            <div className="mb-4 text-6xl font-bold text-blue-600">{count}</div>
            <p className="text-gray-600 dark:text-gray-400">
              This counter state is managed by Zustand
            </p>
          </div>

          {/* Counter Controls */}
          <div className="mb-6 flex justify-center gap-3">
            <button
              onClick={decrement}
              className="rounded-xl bg-red-500 p-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-600"
            >
              <Minus size={20} />
            </button>

            <button
              onClick={increment}
              className="rounded-xl bg-green-500 p-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-600"
            >
              <Plus size={20} />
            </button>

            <button
              onClick={reset}
              className="rounded-xl bg-gray-500 p-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-600"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Status */}
          <div className="text-center">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                count > 0
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : count < 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, next-themes, Zustand, Tailwind CSS & Lucide Icons</p>
        </div>
      </div>
    </div>
  );
}
