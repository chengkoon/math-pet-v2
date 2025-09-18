'use client';

import { useState, useEffect, useMemo } from 'react';
import type { PracticeSessionResponse } from '@chengkoon/mathpet-api-types';

// Type-safe interfaces
interface McqAnswers {
  [questionIndex: number]: number; // Option index
}

interface ShortAnswers {
  [questionIndex: number]: string; // Answer text
}

interface QuestionStatuses {
  [questionIndex: number]: 'unanswered' | 'answered' | 'flagged';
}

interface UseQuestionViewerStateProps {
  session: PracticeSessionResponse | undefined;
}

interface UseQuestionViewerStateReturn {
  // Current state
  currentQuestionIndex: number;
  mcqAnswers: McqAnswers;
  shortAnswers: ShortAnswers;
  questionStatuses: QuestionStatuses;
  showMobilePalette: boolean;

  // Computed values
  answeredCount: number;

  // Actions
  navigation: {
    goToQuestion: (index: number) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    toggleMobilePalette: () => void;
    closeMobilePalette: () => void;
  };

  answers: {
    updateMcqAnswer: (questionIndex: number, optionIndex: number) => void;
    updateShortAnswer: (questionIndex: number, answer: string) => void;
    clearAnswer: (questionIndex: number) => void;
  };

  status: {
    toggleFlag: (questionIndex: number) => void;
    setAnswered: (questionIndex: number) => void;
  };
}

/**
 * useQuestionViewerState - Custom hook for question viewer state management
 * Centralizes all local state logic away from UI components
 * Follows coding standards for proper state separation
 */
export const useQuestionViewerState = ({
  session,
}: UseQuestionViewerStateProps): UseQuestionViewerStateReturn => {
  // Local state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<McqAnswers>({});
  const [shortAnswers, setShortAnswers] = useState<ShortAnswers>({});
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatuses>(
    {}
  );
  const [showMobilePalette, setShowMobilePalette] = useState(false);

  // Create stable dependency for questionAttempts (following Phase 1 pattern)
  const questionAttemptsKey = useMemo(() => {
    if (!session?.questionAttempts) return '';
    return JSON.stringify(
      session.questionAttempts.map((attempt) => ({
        questionIndex: attempt.questionIndex,
        isCorrect: attempt.isCorrect,
      }))
    );
  }, [session?.questionAttempts]);

  // Update current question index when session changes
  useEffect(() => {
    if (session?.currentQuestionIndex !== undefined) {
      setCurrentQuestionIndex(session.currentQuestionIndex);
    }
  }, [session?.currentQuestionIndex]);

  // Initialize question statuses from session attempts
  useEffect(() => {
    if (session?.questionAttempts && session.questionAttempts.length > 0) {
      const statuses: QuestionStatuses = {};
      // Use for...of loop to avoid function reference issues (Phase 1 fix)
      for (const attempt of session.questionAttempts) {
        if (attempt.questionIndex !== undefined) {
          statuses[attempt.questionIndex] = 'answered';
        }
      }
      setQuestionStatuses(statuses);
    }
  }, [questionAttemptsKey, session?.questionAttempts]); // Include both dependencies

  // Calculate answered count
  const answeredCount = useMemo(() => {
    const mcqCount = Object.keys(mcqAnswers).length;
    const shortCount = Object.keys(shortAnswers).filter((key) =>
      shortAnswers[parseInt(key)]?.trim()
    ).length;
    return mcqCount + shortCount;
  }, [mcqAnswers, shortAnswers]);

  // Navigation functions - memoized for stability
  const navigation = useMemo(
    () => ({
      goToQuestion: (index: number) => {
        if (
          index >= 0 &&
          index < (session?.totalQuestions ?? 0) &&
          index !== currentQuestionIndex
        ) {
          setCurrentQuestionIndex(index);
        }
      },

      nextQuestion: () => {
        if (currentQuestionIndex < (session?.totalQuestions ?? 0) - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      },

      previousQuestion: () => {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex((prev) => prev - 1);
        }
      },

      toggleMobilePalette: () => {
        setShowMobilePalette((prev) => !prev);
      },

      closeMobilePalette: () => {
        setShowMobilePalette(false);
      },
    }),
    [currentQuestionIndex, session?.totalQuestions]
  );

  // Answer management functions - memoized for stability
  const answers = useMemo(
    () => ({
      updateMcqAnswer: (questionIndex: number, optionIndex: number) => {
        setMcqAnswers((prev) => ({
          ...prev,
          [questionIndex]: optionIndex,
        }));
        // Remove from short answers if exists
        setShortAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[questionIndex];
          return newAnswers;
        });
      },

      updateShortAnswer: (questionIndex: number, answer: string) => {
        setShortAnswers((prev) => ({
          ...prev,
          [questionIndex]: answer,
        }));
        // Remove from MCQ answers if exists
        setMcqAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[questionIndex];
          return newAnswers;
        });
      },

      clearAnswer: (questionIndex: number) => {
        setMcqAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[questionIndex];
          return newAnswers;
        });
        setShortAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[questionIndex];
          return newAnswers;
        });
        setQuestionStatuses((prev) => ({
          ...prev,
          [questionIndex]: 'unanswered',
        }));
      },
    }),
    []
  );

  // Status management functions - memoized for stability
  const status = useMemo(
    () => ({
      toggleFlag: (questionIndex: number) => {
        setQuestionStatuses((prev) => ({
          ...prev,
          [questionIndex]:
            prev[questionIndex] === 'flagged' ? 'unanswered' : 'flagged',
        }));
      },

      setAnswered: (questionIndex: number) => {
        setQuestionStatuses((prev) => ({
          ...prev,
          [questionIndex]: 'answered',
        }));
      },
    }),
    []
  );

  return {
    // Current state
    currentQuestionIndex,
    mcqAnswers,
    shortAnswers,
    questionStatuses,
    showMobilePalette,

    // Computed values
    answeredCount,

    // Actions
    navigation,
    answers,
    status,
  };
};
