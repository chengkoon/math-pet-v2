import { useCallback } from 'react';
import { useUpdateQuestionAttempt } from '@/hooks/use-practice';
import type { PracticeQuestionResponse } from '@chengkoon/mathpet-api-types';
import { toast } from 'sonner';

interface UseQuestionMutationsProps {
  sessionId: string;
  currentQuestionIndex: number;
  setQuestionStatuses: React.Dispatch<
    React.SetStateAction<Record<number, 'unanswered' | 'answered' | 'flagged'>>
  >;
}

interface UseQuestionMutationsReturn {
  submitMcqAnswer: (
    optionIndex: number,
    question?: PracticeQuestionResponse
  ) => void;
  submitShortAnswer: (
    answerText: string,
    question?: PracticeQuestionResponse
  ) => void;
  isSubmittingAnswer: boolean;
}

/**
 * Custom hook to handle question answer submissions and mutations
 * Follows coding standards by separating API logic from UI components
 */
export const useQuestionMutations = ({
  sessionId,
  currentQuestionIndex,
  setQuestionStatuses,
}: UseQuestionMutationsProps): UseQuestionMutationsReturn => {
  const updateQuestionAttemptMutation = useUpdateQuestionAttempt();

  const submitMcqAnswer = useCallback(
    (optionIndex: number, question?: PracticeQuestionResponse) => {
      if (
        !question?.components ||
        !question.components[optionIndex] ||
        !question.question?.id
      ) {
        toast.error('Unable to submit answer. Please try again.');
        return;
      }

      const selectedOption = question.components[optionIndex];
      if (!selectedOption?.id) {
        toast.error('Invalid option selected. Please try again.');
        return;
      }

      // Update local state immediately for better UX
      setQuestionStatuses((prev) => ({
        ...prev,
        [currentQuestionIndex]: 'answered',
      }));

      updateQuestionAttemptMutation.mutate(
        {
          sessionId,
          request: {
            questionId: question.question.id,
            questionIndex: currentQuestionIndex,
            studentAnswer: selectedOption.contentText || '',
            selectedOptionId: selectedOption.id,
            timeSpentSeconds: 0, // TODO: Track actual time spent
            action: 'ANSWER' as const,
          },
        },
        {
          onError: () => {
            // Revert local state on error
            setQuestionStatuses((prev) => ({
              ...prev,
              [currentQuestionIndex]: 'unanswered',
            }));
          },
        }
      );
    },
    [
      sessionId,
      currentQuestionIndex,
      setQuestionStatuses,
      updateQuestionAttemptMutation,
    ]
  );

  const submitShortAnswer = useCallback(
    (answerText: string, question?: PracticeQuestionResponse) => {
      if (!answerText.trim()) {
        toast.error('Please enter an answer before submitting.');
        return;
      }

      if (!question?.question?.id) {
        toast.error('Unable to submit answer. Please try again.');
        return;
      }

      // Update local state immediately for better UX
      setQuestionStatuses((prev) => ({
        ...prev,
        [currentQuestionIndex]: 'answered',
      }));

      updateQuestionAttemptMutation.mutate(
        {
          sessionId,
          request: {
            questionId: question.question.id,
            questionIndex: currentQuestionIndex,
            studentAnswer: answerText.trim(),
            timeSpentSeconds: 0, // TODO: Track actual time spent
            action: 'ANSWER' as const,
          },
        },
        {
          onError: () => {
            // Revert local state on error
            setQuestionStatuses((prev) => ({
              ...prev,
              [currentQuestionIndex]: 'unanswered',
            }));
          },
        }
      );
    },
    [
      sessionId,
      currentQuestionIndex,
      setQuestionStatuses,
      updateQuestionAttemptMutation,
    ]
  );

  return {
    submitMcqAnswer,
    submitShortAnswer,
    isSubmittingAnswer: updateQuestionAttemptMutation.isPending,
  };
};
