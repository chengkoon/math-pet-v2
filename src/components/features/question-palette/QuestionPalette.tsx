'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Flag, Clock } from 'lucide-react';
import type { PracticeSessionResponse } from '@chengkoon/mathpet-api-types';

interface QuestionStatuses {
  [questionIndex: number]: 'unanswered' | 'answered' | 'flagged';
}

interface QuestionPaletteProps {
  session: PracticeSessionResponse;
  currentQuestionIndex: number;
  questionStatuses: QuestionStatuses;
  onNavigateToQuestion: (questionIndex: number) => void;
  onCompleteSession: () => void;
}

/**
 * QuestionPalette - Desktop sidebar component for question overview
 * Shows session info, question grid, and complete session button
 * Optimized for desktop layout only
 */
export const QuestionPalette = ({
  session,
  currentQuestionIndex,
  questionStatuses,
  onNavigateToQuestion,
  onCompleteSession,
}: QuestionPaletteProps) => {
  // Format time display helper
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get question status icon
  const getQuestionStatusIcon = useCallback(
    (index: number) => {
      const status = questionStatuses[index];
      switch (status) {
        case 'answered':
          return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        case 'flagged':
          return <Flag className="h-4 w-4 text-orange-500" />;
        default:
          return null;
      }
    },
    [questionStatuses]
  );

  // Get question status styling
  const getQuestionStatusColor = useCallback(
    (index: number): string => {
      const status = questionStatuses[index];
      switch (status) {
        case 'answered':
          return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-150';
        case 'flagged':
          return 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-150';
        default:
          return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
      }
    },
    [questionStatuses]
  );

  // Handle question navigation
  const handleQuestionClick = useCallback(
    (index: number) => {
      onNavigateToQuestion(index);
    },
    [onNavigateToQuestion]
  );

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Session Overview
        </h3>
      </CardHeader>

      <CardContent>
        {/* Session Information */}
        <div className="mb-6 space-y-4">
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-white">
              {session.sessionType?.replace('_', ' ') || 'Practice'} Session
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {session.totalQuestions} questions total
            </p>
          </div>

          <div className="text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Progress: {session.questionsAttempted || 0} attempted •{' '}
              {session.questionsCorrect || 0} correct
            </p>
          </div>

          {/* Time spent display */}
          {session.totalTimeSpentSeconds &&
            session.totalTimeSpentSeconds > 0 && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="mr-1 h-4 w-4" />
                Time: {formatTime(session.totalTimeSpentSeconds)}
              </div>
            )}
        </div>

        <Separator className="my-4" />

        {/* Question Grid */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: session.totalQuestions }, (_, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuestionClick(index)}
              className={`relative h-10 w-10 p-0 ${
                index !== currentQuestionIndex
                  ? getQuestionStatusColor(index)
                  : ''
              }`}
            >
              <span className="text-xs font-medium">{index + 1}</span>
              {index !== currentQuestionIndex && (
                <div className="absolute -top-1 -right-1">
                  {getQuestionStatusIcon(index)}
                </div>
              )}
            </Button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded border border-green-300 bg-green-100"></div>
            <span className="text-gray-600 dark:text-gray-400">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded border border-orange-300 bg-orange-100"></div>
            <span className="text-gray-600 dark:text-gray-400">Flagged</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded border border-gray-200 bg-gray-50"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Not Answered
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded border border-blue-700 bg-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Current</span>
          </div>
        </div>

        {/* Complete Session Button */}
        <Button
          className="mt-6 w-full"
          variant="destructive"
          onClick={onCompleteSession}
        >
          Complete Session
        </Button>
      </CardContent>
    </Card>
  );
};
