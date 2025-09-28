'use client';

import { useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';
import type { PracticeSessionResponse } from '@chengkoon/mathpet-api-types';
import {
  getEnhancedQuestionStatusIconByIndex,
  getEnhancedQuestionStatusColorByIndex,
  type QuestionStatuses,
  type EnhancedQuestionStatuses,
} from './question-status-utils';

interface QuestionPaletteProps {
  session: PracticeSessionResponse;
  currentQuestionIndex: number;
  questionStatuses: QuestionStatuses; // Keep for backward compatibility
  enhancedQuestionStatuses?: EnhancedQuestionStatuses; // New enhanced version
  onNavigateToQuestion: (questionIndex: number) => void;
  onCompleteSession: () => void;
}

/**
 * QuestionPalette - Desktop sidebar component for question overview (OPTIMIZED)
 * Shows session info, question grid, and complete session button
 * Uses React.memo to prevent unnecessary re-renders
 * Memoizes expensive operations for 60+ button performance
 */
const QuestionPalette = ({
  session,
  currentQuestionIndex,
  questionStatuses, // eslint-disable-line @typescript-eslint/no-unused-vars -- kept for backward compatibility
  enhancedQuestionStatuses,
  onNavigateToQuestion,
  onCompleteSession,
}: QuestionPaletteProps) => {
  // ✅ CRITICAL: Memoize question indices array to prevent re-creation
  const questionIndices = useMemo(() => {
    return Array.from({ length: session.totalQuestions }, (_, index) => index);
  }, [session.totalQuestions]);

  // ✅ ENHANCED: Create enhanced question statuses with correctness info
  const computedEnhancedQuestionStatuses =
    useMemo((): EnhancedQuestionStatuses => {
      if (enhancedQuestionStatuses) {
        return enhancedQuestionStatuses;
      }

      // Create enhanced statuses from session.questionAttempts
      const enhanced: EnhancedQuestionStatuses = {};

      questionIndices.forEach((index) => {
        // Find the attempt for this question index
        const attempt = session.questionAttempts.find(
          (attempt) => attempt.questionIndex === index
        );

        enhanced[index] = {
          index,
          ...(attempt?.status && { status: attempt.status }),
          ...(attempt?.isCorrect !== undefined && {
            isCorrect: attempt.isCorrect,
          }),
        };
      });

      return enhanced;
    }, [session.questionAttempts, questionIndices, enhancedQuestionStatuses]);
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
          {questionIndices.map((index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuestionClick(index)}
              className={`relative h-10 w-10 p-0 ${
                index !== currentQuestionIndex
                  ? getEnhancedQuestionStatusColorByIndex(
                      index,
                      computedEnhancedQuestionStatuses
                    )
                  : ''
              }`}
            >
              <span className="text-xs font-medium">{index + 1}</span>
              {index !== currentQuestionIndex && (
                <div className="absolute -top-1 -right-1">
                  {getEnhancedQuestionStatusIconByIndex(
                    index,
                    computedEnhancedQuestionStatuses
                  )}
                </div>
              )}
            </Button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded border border-green-300 bg-green-100"></div>
            <span className="text-gray-600 dark:text-gray-400">Correct</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded border border-red-300 bg-red-100"></div>
            <span className="text-gray-600 dark:text-gray-400">Incorrect</span>
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

// ✅ PERFORMANCE: Memoize component to prevent re-renders from parent state changes
// Critical for 60+ question buttons performance
export { QuestionPalette };
export default memo(QuestionPalette);
