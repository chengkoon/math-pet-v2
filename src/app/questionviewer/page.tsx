'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QuestionViewer from '@/components/features/QuestionViewer';

export default function QuestionViewerPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');

  // For demo purposes, you can hardcode a session ID or get it from URL params
  // In a real app, this would come from the URL or be passed from another page

  const handleComplete = () => {
    // Navigate back to the dashboard
    router.push('/dashboard');
  };

  // Demo session ID input (remove in production)
  if (!sessionId) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="text-center">
          <h1 className="mb-6 text-2xl font-bold">Question Viewer Demo</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Enter a session ID to view the question interface:
          </p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Session ID"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setSessionId(e.currentTarget.value.trim());
                }
              }}
            />
            <Button
              onClick={() => {
                const input = document.querySelector(
                  'input'
                ) as HTMLInputElement;
                if (input?.value.trim()) {
                  setSessionId(input.value.trim());
                }
              }}
            >
              Start Session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Navigation - positioned absolute to not interfere with QuestionViewer */}
      <div className="absolute top-4 left-4 z-30">
        <Button variant="ghost" onClick={() => setSessionId('')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Demo
        </Button>
      </div>

      {/* Question Viewer Component */}
      <QuestionViewer sessionId={sessionId} onComplete={handleComplete} />
    </div>
  );
}
