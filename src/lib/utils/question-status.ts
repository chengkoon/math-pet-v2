import type { PracticeQuestionResponse } from '@chengkoon/mathpet-api-types';

/**
 * Utility function to check if a question is answered
 * Pure function - no hooks, can be used anywhere
 */
export const isQuestionAnswered = (
  question?: PracticeQuestionResponse
): boolean => {
  if (!question?.attempts || question.attempts.length === 0) {
    return false;
  }
  return question.attempts[0]?.status === 'ANSWERED';
};

/**
 * Get the latest attempt for a question
 */
export const getLatestAttempt = (question?: PracticeQuestionResponse) => {
  if (!question?.attempts || question.attempts.length === 0) {
    return null;
  }
  return question.attempts[0];
};

/**
 * Check if a question has any attempts
 */
export const hasAttempts = (question?: PracticeQuestionResponse): boolean => {
  return !!(question?.attempts && question.attempts.length > 0);
};
