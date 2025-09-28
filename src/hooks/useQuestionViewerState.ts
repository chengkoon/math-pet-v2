'use client';

import { useState, useEffect, useMemo } from 'react';
import type { PracticeSessionResponse } from '@chengkoon/mathpet-api-types';
import type { QuestionStatuses } from '@/components/features/question-palette/question-status-utils';

// Type-safe interfaces
interface McqAnswers {
  [questionIndex: number]: number; // Option index
}

interface ShortAnswers {
  [questionIndex: number]: string; // Answer text
}

interface WorkingSteps {
  [questionIndex: number]: string[]; // Array of working step strings
}

interface UseQuestionViewerStateProps {
  session: PracticeSessionResponse | undefined;
}

interface UseQuestionViewerStateReturn {
  // Current state
  currentQuestionIndex: number | undefined; // undefined only during initial load
  mcqAnswers: McqAnswers;
  shortAnswers: ShortAnswers;
  workingSteps: WorkingSteps;
  questionStatuses: QuestionStatuses;
  showMobilePalette: boolean;

  // Computed values
  answeredCount: number;

  // Loading states
  isInitializing: boolean; // true when currentQuestionIndex is undefined

  // State setters
  setQuestionStatuses: React.Dispatch<React.SetStateAction<QuestionStatuses>>;

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
    updateWorkingSteps: (questionIndex: number, steps: string[]) => void;
    clearAnswer: (questionIndex: number) => void;
  };

  status: {
    toggleFlag: (questionIndex: number) => void;
    setAnswered: (questionIndex: number) => void;
  };
}

export type { UseQuestionViewerStateReturn };

/**
 * useQuestionViewerState - Custom hook for question viewer state management
 * Centralizes all local state logic away from UI components
 * Follows coding standards for proper state separation
 */
export const useQuestionViewerState = ({
  session,
}: UseQuestionViewerStateProps): UseQuestionViewerStateReturn => {
  // Local state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | undefined
  >(undefined);
  const [mcqAnswers, setMcqAnswers] = useState<McqAnswers>({});
  const [shortAnswers, setShortAnswers] = useState<ShortAnswers>({});
  const [workingSteps, setWorkingSteps] = useState<WorkingSteps>({});
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
    if (session) {
      // If session has a currentQuestionIndex, use it (resuming session)
      // Otherwise, start from question 0 (new session)
      const questionIndex = session.currentQuestionIndex ?? 0;
      setCurrentQuestionIndex(questionIndex);
    }
  }, [session]); // Watch entire session object for changes

  // Initialize question statuses from session attempts
  useEffect(() => {
    console.log('session :', session);
    if (session?.questionAttempts && session.questionAttempts.length > 0) {
      const statuses: QuestionStatuses = {};
      // Use for...of loop to avoid function reference issues (Phase 1 fix)
      for (const attempt of session.questionAttempts) {
        if (attempt.questionIndex !== undefined) {
          statuses[attempt.questionIndex] = attempt.status;
        }
      }
      setQuestionStatuses(statuses);
    }
  }, [questionAttemptsKey, session]); // Include session dependency but use stable questionAttemptsKey

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
        console.log('Next question from index:', currentQuestionIndex);
        if (
          currentQuestionIndex !== undefined &&
          currentQuestionIndex < (session?.totalQuestions ?? 0) - 1
        ) {
          setCurrentQuestionIndex((prev) => (prev ?? 0) + 1);
        }
      },

      previousQuestion: () => {
        if (currentQuestionIndex !== undefined && currentQuestionIndex > 0) {
          setCurrentQuestionIndex((prev) => (prev ?? 0) - 1);
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

      updateWorkingSteps: (questionIndex: number, steps: string[]) => {
        setWorkingSteps((prev) => ({
          ...prev,
          [questionIndex]: steps,
        }));
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
        setWorkingSteps((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[questionIndex];
          return newAnswers;
        });
        setQuestionStatuses((prev) => ({
          ...prev,
          [questionIndex]: 'ANSWERED',
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
          [questionIndex]: prev[questionIndex],
        }));
      },

      setAnswered: (questionIndex: number) => {
        setQuestionStatuses((prev) => ({
          ...prev,
          [questionIndex]: 'ANSWERED',
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
    workingSteps,
    questionStatuses,
    showMobilePalette,

    // Computed values
    answeredCount,

    // Loading states
    isInitializing: currentQuestionIndex === undefined,

    // State setters
    setQuestionStatuses,

    // Actions
    navigation,
    answers,
    status,
  };
};
