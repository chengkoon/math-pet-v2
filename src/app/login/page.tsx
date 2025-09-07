import { Metadata } from 'next';
import Link from 'next/link';
import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Login | MathPet',
  description: 'Sign in to your MathPet account',
};

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo/Brand */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-medium hover:opacity-80 transition-opacity"
          >
            <div className="bg-blue-600 text-white flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            MathPet
          </Link>
        </div>

        {/* Centered Login Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right Column - Cover Image */}
      <div className="bg-gray-50 dark:bg-gray-900 relative hidden lg:block">
        {/* Placeholder for math/education themed image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400 dark:text-gray-600">
            <div className="mb-4 text-6xl">📚</div>
            <p className="text-lg font-medium">Master Math with MathPet</p>
            <p className="text-sm">Practice makes perfect</p>
          </div>
        </div>
        
        {/* Optional: Replace with actual image when available */}
        {/* 
        <img 
          src="/login-cover.jpg" 
          alt="MathPet Learning Platform" 
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" 
        />
        */}
      </div>
    </div>
  );
}