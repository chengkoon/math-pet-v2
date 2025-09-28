'use client';

import { useMemo } from 'react';
import { usePracticeSessionQuestion } from '@/hooks/use-practice';
import type { PracticeQuestionResponse } from '@chengkoon/mathpet-api-types';

interface UseCurrentQuestionStatusProps {
  sessionId: string;
  questionIndex?: number | undefined;
}

interface UseCurrentQuestionStatusReturn {
  currentQuestion: PracticeQuestionResponse | undefined;
  isCurrentQuestionAnswered: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * useCurrentQuestionStatus - Separate hook for managing current question status
 *
 * This hook encapsulates the logic for determining if the current question is answered
 * while keeping server state management separate from UI state management.
 *
 * Usage example:
 * ```tsx
 * const { currentQuestion, isCurrentQuestionAnswered } = useCurrentQuestionStatus({
 *   sessionId,
 *   questionIndex: viewerState.currentQuestionIndex
 * });
 * ```
 */
export const useCurrentQuestionStatus = ({
  sessionId,
  questionIndex,
}: UseCurrentQuestionStatusProps): UseCurrentQuestionStatusReturn => {
  // Get current question data from TanStack Query
  const {
    data: currentQuestion,
    isLoading,
    error,
  } = usePracticeSessionQuestion(sessionId, questionIndex);

  // Check if current question is already answered
  const isCurrentQuestionAnswered = useMemo(() => {
    if (!currentQuestion?.attempts || currentQuestion.attempts.length === 0) {
      return false;
    }
    return currentQuestion.attempts[0]?.status === 'ANSWERED';
  }, [currentQuestion?.attempts]);

  return {
    currentQuestion,
    isCurrentQuestionAnswered,
    isLoading,
    error,
  };
};
