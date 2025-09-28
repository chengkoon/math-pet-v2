import type { QuestionAttemptResponseStatusEnum } from '@chengkoon/mathpet-api-types';
import { CheckCircle2, Flag, XCircle } from 'lucide-react';

export interface QuestionStatuses {
  [questionIndex: number]: QuestionAttemptResponseStatusEnum | undefined;
}

export interface EnhancedQuestionInfo {
  index: number;
  status?: QuestionAttemptResponseStatusEnum;
  isCorrect?: boolean;
}

export interface EnhancedQuestionStatuses {
  [questionIndex: number]: EnhancedQuestionInfo;
}

/**
 * Get the status icon for a question based on its status and correctness
 * @param status - The question status
 * @param isCorrect - Whether the answer is correct (only relevant for ANSWERED status)
 * @param size - Icon size class (default: 'h-4 w-4')
 * @returns JSX element for the status icon or null
 */
export const getQuestionStatusIcon = (
  status: QuestionAttemptResponseStatusEnum | undefined,
  isCorrect?: boolean,
  size: string = 'h-4 w-4'
) => {
  switch (status) {
    case 'ANSWERED':
      return isCorrect ? (
        <CheckCircle2
          className={`${size} text-green-600 dark:text-green-400`}
        />
      ) : (
        <XCircle className={`${size} text-red-600 dark:text-red-400`} />
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
  return getQuestionStatusIcon(status, undefined, size);
};

/**
 * Get the status icon for a question by index using enhanced info
 * @param questionIndex - The question index
 * @param enhancedQuestionStatuses - Object containing enhanced question info
 * @param size - Icon size class (default: 'h-4 w-4')
 * @returns JSX element for the status icon or null
 */
export const getEnhancedQuestionStatusIconByIndex = (
  questionIndex: number,
  enhancedQuestionStatuses: EnhancedQuestionStatuses,
  size: string = 'h-4 w-4'
) => {
  const questionInfo = enhancedQuestionStatuses[questionIndex];
  if (!questionInfo) return null;

  return getQuestionStatusIcon(
    questionInfo.status,
    questionInfo.isCorrect,
    size
  );
};

/**
 * Get the CSS classes for question status styling with correctness
 * @param status - The question status
 * @param isCorrect - Whether the answer is correct (only relevant for ANSWERED status)
 * @returns CSS class string for the status
 */
export const getQuestionStatusColor = (
  status: QuestionAttemptResponseStatusEnum | undefined,
  isCorrect?: boolean
): string => {
  switch (status) {
    case 'ANSWERED':
      return isCorrect
        ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-150 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
        : 'bg-red-100 border-red-300 text-red-800 hover:bg-red-150 dark:bg-red-900 dark:border-red-700 dark:text-red-200';
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
 * Get the CSS classes for question status styling by index using enhanced info
 * @param questionIndex - The question index
 * @param enhancedQuestionStatuses - Object containing enhanced question info
 * @returns CSS class string for the status
 */
export const getEnhancedQuestionStatusColorByIndex = (
  questionIndex: number,
  enhancedQuestionStatuses: EnhancedQuestionStatuses
): string => {
  const questionInfo = enhancedQuestionStatuses[questionIndex];
  if (!questionInfo) return getQuestionStatusColor(undefined);

  return getQuestionStatusColor(questionInfo.status, questionInfo.isCorrect);
};

/**
 * Get accessibility label for a question with correctness info
 * @param questionIndex - The question index (0-based)
 * @param status - The question status
 * @param isCorrect - Whether the answer is correct
 * @param isCurrent - Whether this is the current question
 * @returns Accessibility label string
 */
export const getQuestionAccessibilityLabel = (
  questionIndex: number,
  status: QuestionAttemptResponseStatusEnum | undefined,
  isCorrect?: boolean,
  isCurrent: boolean = false
): string => {
  const questionNumber = questionIndex + 1;
  let statusText = '';

  if (status === 'ANSWERED') {
    statusText =
      isCorrect === true
        ? ', answered correctly'
        : isCorrect === false
          ? ', answered incorrectly'
          : ', answered';
  }

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
  return getQuestionAccessibilityLabel(
    questionIndex,
    status,
    undefined,
    isCurrent
  );
};

/**
 * Get accessibility label for a question by index using enhanced info
 * @param questionIndex - The question index (0-based)
 * @param enhancedQuestionStatuses - Object containing enhanced question info
 * @param currentQuestionIndex - The current question index
 * @returns Accessibility label string
 */
export const getEnhancedQuestionAccessibilityLabelByIndex = (
  questionIndex: number,
  enhancedQuestionStatuses: EnhancedQuestionStatuses,
  currentQuestionIndex: number
): string => {
  const questionInfo = enhancedQuestionStatuses[questionIndex];
  const isCurrent = questionIndex === currentQuestionIndex;

  if (!questionInfo) {
    return getQuestionAccessibilityLabel(
      questionIndex,
      undefined,
      undefined,
      isCurrent
    );
  }

  return getQuestionAccessibilityLabel(
    questionIndex,
    questionInfo.status,
    questionInfo.isCorrect,
    isCurrent
  );
};
