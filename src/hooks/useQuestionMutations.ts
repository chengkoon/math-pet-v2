import { useCallback } from 'react';
import { useCheckQuestionAnswer } from '@/hooks/use-practice';
import type {
  PracticeQuestionResponse,
  CheckQuestionAnswerRequest,
} from '@chengkoon/mathpet-api-types';
import type { QuestionStatuses } from '@/components/features/question-palette/question-status-utils';
import { toast } from 'sonner';

interface UseQuestionMutationsProps {
  sessionId: string;
  currentQuestionIndex: number;
  setQuestionStatuses: React.Dispatch<React.SetStateAction<QuestionStatuses>>;
  workingSteps: string[]; // Working steps for current question
}

interface SubmitAnswerParams {
  question?: PracticeQuestionResponse | undefined;
  answerText?: string | undefined;
  optionIndex?: number | undefined;
}

interface UseQuestionMutationsReturn {
  submitAnswer: (params: SubmitAnswerParams) => void;
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
  const checkQuestionAnswerMutation = useCheckQuestionAnswer();

  const submitAnswer = useCallback(
    ({ question, answerText, optionIndex }: SubmitAnswerParams) => {
      // Validate that we have either answerText or optionIndex
      if (!answerText && optionIndex === undefined) {
        toast.error('Please provide an answer before submitting.');
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

      let studentAnswer: string;
      let selectedOptionId: number | undefined;

      // Handle MCQ submission
      if (optionIndex !== undefined) {
        if (!question.components || !question.components[optionIndex]) {
          toast.error('Invalid option selected. Please try again.');
          return;
        }

        const selectedOption = question.components[optionIndex];
        if (!selectedOption?.id) {
          toast.error('Invalid option selected. Please try again.');
          return;
        }

        studentAnswer = selectedOption.contentText || '';
        selectedOptionId = selectedOption.id;
      }
      // Handle short answer submission
      else if (answerText) {
        if (!answerText.trim()) {
          toast.error('Please enter an answer before submitting.');
          return;
        }
        studentAnswer = answerText.trim();
      } else {
        toast.error('Please provide a valid answer.');
        return;
      }

      // Update local state immediately for better UX
      setQuestionStatuses((prev) => ({
        ...prev,
        [currentQuestionIndex]: 'ANSWERED',
      }));

      // Prepare working steps - only include if there are valid steps
      const validWorkingSteps = workingSteps.filter((step) => step.trim());
      const requestPayload: CheckQuestionAnswerRequest = {
        attemptId: currentAttempt.id,
        questionId: question.question.id,
        questionIndex: currentQuestionIndex,
        studentAnswer,
        timeSpentSeconds: 0, // TODO: Track actual time spent
        action: 'ANSWER' as const,
        ...(selectedOptionId && { selectedOptionId }),
        ...(validWorkingSteps.length > 0 && {
          studentWorkingSteps: validWorkingSteps,
        }),
      };

      checkQuestionAnswerMutation.mutate(
        {
          sessionId,
          request: requestPayload,
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
      checkQuestionAnswerMutation,
      workingSteps,
    ]
  );

  return {
    submitAnswer,
    isSubmittingAnswer: checkQuestionAnswerMutation.isPending,
  };
};
