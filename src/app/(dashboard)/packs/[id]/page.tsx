'use client';

import { use } from 'react';
import { usePackStructure } from '@/hooks/use-pack-structure';
import { useStartPracticeSession } from '@/hooks/use-practice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import type { Paper } from '@chengkoon/mathpet-api-types';

interface PackDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PackDetailsPage({ params }: PackDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: packStructure, isLoading, error } = usePackStructure(id);
  const startPracticeSessionMutation = useStartPracticeSession();

  const handleStartPaper = async () => {
    try {
      const response = await startPracticeSessionMutation.mutateAsync({
        packId: id,
      });

      // Navigate to the practice session page
      router.push(`/session/${response.id}`);
    } catch (error) {
      console.error('Failed to start practice session:', error);
      // Error is already handled by the mutation hook with toast
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="mb-4 h-4 w-96" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !packStructure) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Pack Not Found
          </h1>
          <p className="text-red-600 dark:text-red-400">
            Unable to load pack structure. The pack may not exist or there was
            an error loading it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Packs
      </Button>

      <div className="space-y-6">
        {/* Pack Header */}
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {packStructure.packTitle || 'Untitled Pack'}
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Pack ID: {packStructure.packId}
          </p>
          {packStructure.packType && (
            <Badge variant="secondary" className="mb-6">
              <BookOpen className="mr-1 h-3 w-3" />
              {packStructure.packType}
            </Badge>
          )}
        </div>

        {/* Papers Grid */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Papers ({packStructure.papers?.length || 0})
          </h2>

          {packStructure.papers && packStructure.papers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {packStructure.papers.map((paper: Paper, index: number) => (
                <Card
                  key={paper.id || index}
                  className="transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <FileText className="mr-2 h-5 w-5" />
                      {paper.title || `Paper ${index + 1}`}
                    </CardTitle>
                    {paper.paperOrder && (
                      <CardDescription>
                        Paper {paper.paperOrder}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Sections:</span>
                        <span>{paper.sections?.length || 0}</span>
                      </div>
                      {paper.totalMarks && (
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Total Marks:</span>
                          <span>{paper.totalMarks}</span>
                        </div>
                      )}
                      {paper.timeLimitMinutes && (
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Time Limit:</span>
                          <span>{paper.timeLimitMinutes} minutes</span>
                        </div>
                      )}
                      <Button
                        className="mt-4 w-full"
                        disabled={startPracticeSessionMutation.isPending}
                        onClick={() => handleStartPaper()}
                      >
                        {startPracticeSessionMutation.isPending
                          ? 'Starting...'
                          : 'Start Paper'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  No Papers Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This pack doesn&apos;t contain any papers yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
