// src/components/ui/educational-toast.tsx
'use client';

import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface EducationalToastProps {
  title: string;
  description: string;
  type?: 'success' | 'error' | 'info';
}

// Custom toast component that matches the design
export function showEducationalToast({
  title,
  description,
  type = 'success',
}: EducationalToastProps) {
  return toast.custom(
    () => (
      <div className="animate-in slide-in-from-top-2 relative max-w-[400px] min-w-[320px] transform overflow-hidden rounded-3xl p-6 shadow-2xl transition-all duration-300 ease-out">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-green-400 to-green-500" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating sparkles */}
          <div className="absolute top-4 left-8 h-2 w-2 animate-pulse rounded-full bg-white opacity-80" />
          <div className="absolute top-6 right-12 h-1 w-1 animate-pulse rounded-full bg-white opacity-60 delay-100" />
          <div className="absolute bottom-8 left-12 h-1.5 w-1.5 animate-pulse rounded-full bg-white opacity-70 delay-200" />

          {/* Colorful confetti pieces */}
          <div className="absolute top-8 right-8 h-1 w-3 rotate-45 transform animate-bounce rounded-full bg-red-400 delay-75" />
          <div className="absolute top-12 left-16 h-3 w-2 -rotate-12 transform animate-bounce rounded-sm bg-blue-400 delay-150" />
          <div className="absolute right-16 bottom-12 h-2 w-2 animate-bounce rounded-full bg-pink-400 delay-300" />
          <div className="absolute top-16 right-24 h-4 w-1 rotate-12 transform animate-bounce rounded-full bg-orange-400 delay-500" />
          <div className="absolute bottom-16 left-20 h-1 w-3 -rotate-45 transform animate-bounce rounded-full bg-purple-400 delay-700" />

          {/* Star sparkles */}
          <div className="absolute top-10 right-6 animate-pulse text-lg text-white delay-400">
            ✨
          </div>
          <div className="absolute right-8 bottom-6 animate-pulse text-sm text-white delay-600">
            ✨
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center">
          {/* Check Icon Circle */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <Check className="h-7 w-7 stroke-[3] text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">
            {title}
          </h3>

          {/* Description */}
          <p className="text-base font-medium text-white opacity-95 drop-shadow-md">
            {description}
          </p>
        </div>
      </div>
    ),
    {
      duration: 400000,
      position: 'top-center',
    }
  );
}

// Convenience functions for different types
export const showCorrectAnswerToast = () => {
  return showEducationalToast({
    title: 'Awesome!',
    description: "That's the correct answer! Keep up the great work! ✨",
    type: 'success',
  });
};

export const showWrongAnswerToast = () => {
  return toast.custom(
    () => (
      <div className="animate-in slide-in-from-top-2 relative max-w-[400px] min-w-[320px] transform overflow-hidden rounded-3xl p-6 shadow-2xl transition-all duration-300 ease-out">
        {/* Gradient Background - Red/Orange for wrong answer */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-red-500" />

        {/* Main Content */}
        <div className="relative z-10 text-center">
          {/* X Icon Circle */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-orange-500 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <span className="text-2xl font-bold text-red-600">✗</span>
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">
            Oops!
          </h3>

          <p className="text-base font-medium text-white opacity-95 drop-shadow-md">
            That's not quite right. Try again! 💪
          </p>
        </div>
      </div>
    ),
    {
      duration: 3000,
      position: 'top-center',
    }
  );
};

export const showEncouragementToast = (message: string) => {
  return showEducationalToast({
    title: 'Great job!',
    description: message,
    type: 'info',
  });
};

// Usage example component
export function ToastExample() {
  return (
    <div className="flex gap-4 p-4">
      <button
        onClick={showCorrectAnswerToast}
        className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
      >
        Show Correct Answer Toast
      </button>

      <button
        onClick={showWrongAnswerToast}
        className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
      >
        Show Wrong Answer Toast
      </button>

      <button
        onClick={() =>
          showEncouragementToast("You're doing amazing! Keep going! 🌟")
        }
        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Show Encouragement Toast
      </button>
    </div>
  );
}
