import { useCallback } from 'react';
import { useUpdateQuestionAttempt } from '@/hooks/use-practice';
import type { PracticeQuestionResponse } from '@chengkoon/mathpet-api-types';
import type { QuestionStatuses } from '@/components/features/question-palette/question-status-utils';
import { toast } from 'sonner';

interface UseQuestionMutationsProps {
  sessionId: string;
  currentQuestionIndex: number;
  setQuestionStatuses: React.Dispatch<React.SetStateAction<QuestionStatuses>>;
  workingSteps: string; // Working steps for current question
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
  workingSteps,
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

      // Get the current attempt ID from the question's attempts
      const currentAttempt = question.attempts?.find(
        (attempt) => attempt.questionIndex === currentQuestionIndex
      );

      if (!currentAttempt?.id) {
        toast.error('Unable to find attempt record. Please try again.');
        return;
      }

      // Update local state immediately for better UX
      setQuestionStatuses((prev) => ({
        ...prev,
        [currentQuestionIndex]: 'ANSWERED',
      }));

      updateQuestionAttemptMutation.mutate(
        {
          sessionId,
          request: {
            attemptId: currentAttempt.id,
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
              [currentQuestionIndex]: 'ENTERED',
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

      // Get the current attempt ID from the question's attempts
      const currentAttempt = question.attempts?.find(
        (attempt) => attempt.questionIndex === currentQuestionIndex
      );

      if (!currentAttempt?.id) {
        toast.error('Unable to find attempt record. Please try again.');
        return;
      }

      // Update local state immediately for better UX
      setQuestionStatuses((prev) => ({
        ...prev,
        [currentQuestionIndex]: 'ANSWERED',
      }));

      updateQuestionAttemptMutation.mutate(
        {
          sessionId,
          request: {
            attemptId: currentAttempt.id,
            questionId: question.question.id,
            studentWorkingSteps: workingSteps ? [workingSteps] : [''],
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
              [currentQuestionIndex]: 'ENTERED',
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
      workingSteps,
    ]
  );

  return {
    submitMcqAnswer,
    submitShortAnswer,
    isSubmittingAnswer: updateQuestionAttemptMutation.isPending,
  };
};
