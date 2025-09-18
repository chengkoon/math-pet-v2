'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  mcqAnswer: number | undefined;
  shortAnswer: string;
  onPrevious: () => void;
  onNext: () => void;
  onClearAnswer: () => void;
  onBookmark: () => void;
  onComplete: () => void;
}

/**
 * QuestionNavigation - Atomic component for question navigation controls
 * Handles previous/next/clear/bookmark actions
 * Does NOT handle question display or session management
 */
export const QuestionNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  mcqAnswer,
  shortAnswer,
  onPrevious,
  onNext,
  onClearAnswer,
  onBookmark,
  onComplete,
}: QuestionNavigationProps) => {
  // Check if there's an answer to clear
  const hasAnswer = Boolean(mcqAnswer !== undefined || shortAnswer.trim());

  // Check if this is the last question
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  // Handle next/complete action
  const handleNextOrComplete = useCallback(() => {
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  }, [isLastQuestion, onComplete, onNext]);

  return (
    <div className="flex items-center justify-between">
      {/* Previous Button */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        {/* Mobile view - show only symbol */}
        <span className="block sm:hidden">
          <ChevronLeft className="h-4 w-4" />
        </span>
        {/* Desktop view - show text with icon */}
        <span className="hidden sm:flex sm:items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </span>
      </Button>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onClearAnswer} disabled={!hasAnswer}>
          Clear Answer
        </Button>

        <Button variant="outline" onClick={onBookmark}>
          <Bookmark className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Bookmark</span>
        </Button>
      </div>

      {/* Next/Complete Button */}
      <Button onClick={handleNextOrComplete}>
        {/* Mobile view - show only symbol */}
        <span className="block sm:hidden">
          <ChevronRight className="h-4 w-4" />
        </span>
        {/* Desktop view - show text with icon */}
        <span className="hidden sm:flex sm:items-center">
          {isLastQuestion ? 'Complete' : 'Next'}
          <ChevronRight className="ml-1 h-4 w-4" />
        </span>
      </Button>
    </div>
  );
};
