'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
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
      {/* Question Viewer Component */}
      <QuestionViewer sessionId={sessionId} onComplete={handleComplete} />
    </div>
  );
}
