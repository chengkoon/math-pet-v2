'use client'

import { useAppStore } from '@/store/useAppStore'
import { Plus, Minus, RotateCcw, Heart } from 'lucide-react'

export default function HomePage() {
  const { 
    count, 
    name, 
    theme, 
    increment, 
    decrement, 
    reset, 
    setName, 
    toggleTheme 
  } = useAppStore()

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hello, {name}! 
          </h1>
          <p className="text-xl opacity-70 mb-8">
            Welcome to your Next.js app with Zustand state management
          </p>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              isDark
                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Name Input */}
        <div className="max-w-md mx-auto mb-12">
          <label className="block text-sm font-medium mb-2 opacity-70">
            Change your name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
              isDark
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>

        {/* Counter Section */}
        <div className={`max-w-md mx-auto rounded-2xl p-8 shadow-xl transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800 shadow-gray-900/50' 
            : 'bg-white shadow-gray-300/50'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
              <Heart className="text-red-500" size={24} />
              Counter Demo
            </h2>
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {count}
            </div>
            <p className="opacity-70">
              This counter state is managed by Zustand
            </p>
          </div>

          {/* Counter Controls */}
          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={decrement}
              className={`p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } shadow-lg`}
            >
              <Minus size={20} />
            </button>
            
            <button
              onClick={increment}
              className={`p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } shadow-lg`}
            >
              <Plus size={20} />
            </button>
            
            <button
              onClick={reset}
              className={`p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              } shadow-lg`}
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Status */}
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              count > 0 
                ? 'bg-green-100 text-green-800' 
                : count < 0 
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 opacity-60">
          <p>Built with Next.js, Zustand, Tailwind CSS & Lucide Icons</p>
        </div>
      </div>
    </div>
  )
}