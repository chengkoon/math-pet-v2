import type { QuestionAttemptResponseStatusEnum } from '@chengkoon/mathpet-api-types';
import { CheckCircle2, Flag } from 'lucide-react';

export interface QuestionStatuses {
  [questionIndex: number]: QuestionAttemptResponseStatusEnum | undefined;
}

/**
 * Get the status icon for a question based on its status
 * @param status - The question status
 * @param size - Icon size class (default: 'h-4 w-4')
 * @returns JSX element for the status icon or null
 */
export const getQuestionStatusIcon = (
  status: QuestionAttemptResponseStatusEnum | undefined,
  size: string = 'h-4 w-4'
) => {
  switch (status) {
    case 'ANSWERED':
      return (
        <CheckCircle2
          className={`${size} text-green-600 dark:text-green-400`}
        />
      );
    // case 'flagged':
    //   return (
    //     <Flag className={`${size} text-orange-500 dark:text-orange-400`} />
    //   );
    default:
      return null;
  }
};

/**
 * Get the status icon for a question by index
 * @param questionIndex - The question index
 * @param questionStatuses - Object containing all question statuses
 * @param size - Icon size class (default: 'h-4 w-4')
 * @returns JSX element for the status icon or null
 */
export const getQuestionStatusIconByIndex = (
  questionIndex: number,
  questionStatuses: QuestionStatuses,
  size: string = 'h-4 w-4'
) => {
  const status = questionStatuses[questionIndex];
  return getQuestionStatusIcon(status, size);
};

/**
 * Get the CSS classes for question status styling
 * @param status - The question status
 * @returns CSS class string for the status
 */
export const getQuestionStatusColor = (
  status: QuestionAttemptResponseStatusEnum | undefined
): string => {
  switch (status) {
    case 'ANSWERED':
      return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-150 dark:bg-green-900 dark:border-green-700 dark:text-green-200';
    // case 'flagged':
    //   return 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-150 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300';
  }
};

/**
 * Get the CSS classes for question status styling by index
 * @param questionIndex - The question index
 * @param questionStatuses - Object containing all question statuses
 * @returns CSS class string for the status
 */
export const getQuestionStatusColorByIndex = (
  questionIndex: number,
  questionStatuses: QuestionStatuses
): string => {
  const status = questionStatuses[questionIndex];
  return getQuestionStatusColor(status);
};

/**
 * Get accessibility label for a question
 * @param questionIndex - The question index (0-based)
 * @param status - The question status
 * @param isCurrent - Whether this is the current question
 * @returns Accessibility label string
 */
export const getQuestionAccessibilityLabel = (
  questionIndex: number,
  status: QuestionAttemptResponseStatusEnum | undefined,
  isCurrent: boolean = false
): string => {
  const questionNumber = questionIndex + 1;
  const statusText = status === 'ANSWERED' ? ', answered' : '';
  const currentText = isCurrent ? ', currently selected' : '';

  return `Question ${questionNumber}${statusText}${currentText}`;
};

/**
 * Get accessibility label for a question by index
 * @param questionIndex - The question index (0-based)
 * @param questionStatuses - Object containing all question statuses
 * @param currentQuestionIndex - The current question index
 * @returns Accessibility label string
 */
export const getQuestionAccessibilityLabelByIndex = (
  questionIndex: number,
  questionStatuses: QuestionStatuses,
  currentQuestionIndex: number
): string => {
  const status = questionStatuses[questionIndex];
  const isCurrent = questionIndex === currentQuestionIndex;
  return getQuestionAccessibilityLabel(questionIndex, status, isCurrent);
};
