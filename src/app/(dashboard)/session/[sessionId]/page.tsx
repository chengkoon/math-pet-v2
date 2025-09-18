'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QuestionViewer from '@/components/features/QuestionViewer';

interface SessionPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();

  const handleComplete = () => {
    // Navigate back to the pack or dashboard
    router.push('/dashboard/packs');
  };

  return (
    <div>
      {/* Back Navigation - positioned absolute to not interfere with QuestionViewer */}
      <div className="absolute top-4 left-4 z-30">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pack
        </Button>
      </div>

      {/* Question Viewer Component */}
      <QuestionViewer sessionId={sessionId} onComplete={handleComplete} />
    </div>
  );
}
