'use client';

import { useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  hasAnswer?: boolean;
  isSubmittingAnswer?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCheckAnswer: () => void;
  onBookmark: () => void;
  onComplete: () => void;
}

/**
 * QuestionNavigation - Atomic component for question navigation controls
 * Handles previous/next/clear/bookmark actions
 * Does NOT handle question display or session management
 */
const QuestionNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  hasAnswer = false,
  isSubmittingAnswer = false,
  onPrevious,
  onNext,
  onCheckAnswer,
  onBookmark,
  onComplete,
}: QuestionNavigationProps) => {
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
    <div className="flex items-center justify-between py-4">
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
        <Button
          variant="outline"
          onClick={onCheckAnswer}
          disabled={isSubmittingAnswer}
          className={
            hasAnswer
              ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
              : ''
          }
        >
          {isSubmittingAnswer ? 'Checking...' : 'Check Answer'}
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

// ✅ PERFORMANCE: Memoize component to prevent unnecessary re-renders
export { QuestionNavigation };
export default memo(QuestionNavigation);
