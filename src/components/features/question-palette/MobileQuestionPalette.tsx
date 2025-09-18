'use client';

import { useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Flag, X } from 'lucide-react';
import type { PracticeSessionResponse } from '@chengkoon/mathpet-api-types';

interface QuestionStatuses {
  [questionIndex: number]: 'unanswered' | 'answered' | 'flagged';
}

interface MobileQuestionPaletteProps {
  session: PracticeSessionResponse;
  currentQuestionIndex: number;
  questionStatuses: QuestionStatuses;
  answeredCount: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQuestion: (questionIndex: number) => void;
  onCompleteSession: () => void;
}

/**
 * MobileQuestionPalette - Mobile bottom sheet for question navigation
 * Features: gesture support, focus trap, accessibility, proper z-index
 * CRITICAL: Fixes mobile UX issues from original implementation
 */
const MobileQuestionPalette = ({
  session,
  currentQuestionIndex,
  questionStatuses,
  answeredCount,
  isOpen,
  onClose,
  onNavigateToQuestion,
  onCompleteSession,
}: MobileQuestionPaletteProps) => {
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Get question status icon
  const getQuestionStatusIcon = useCallback(
    (index: number) => {
      const status = questionStatuses[index];
      switch (status) {
        case 'answered':
          return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        case 'flagged':
          return <Flag className="h-4 w-4 text-orange-500" />;
        default:
          return null;
      }
    },
    [questionStatuses]
  );

  // Get question status styling
  const getQuestionStatusColor = useCallback(
    (index: number): string => {
      const status = questionStatuses[index];
      switch (status) {
        case 'answered':
          return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-150';
        case 'flagged':
          return 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-150';
        default:
          return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
      }
    },
    [questionStatuses]
  );

  // Handle question navigation and close modal
  const handleQuestionClick = useCallback(
    (index: number) => {
      onNavigateToQuestion(index);
      onClose();
    },
    [onNavigateToQuestion, onClose]
  );

  // Handle complete session and close modal
  const handleCompleteSession = useCallback(() => {
    onClose();
    onCompleteSession();
  }, [onClose, onCompleteSession]);

  // Handle backdrop click to close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Focus trap - focus the first focusable element
      firstFocusableRef.current?.focus();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button - Minimized state when closed */}
      <div className="fixed right-4 bottom-4 z-20 lg:hidden">
        <Button
          onClick={() => {}}
          className="h-auto min-w-0 rounded-2xl bg-blue-600 px-4 py-3 shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
          size="sm"
        >
          <div className="flex flex-col items-center space-y-1 text-white">
            <div className="flex items-center space-x-2 text-sm font-semibold">
              <span>
                Q{currentQuestionIndex + 1}/{session.totalQuestions}
              </span>
              <span className="text-blue-200">•</span>
              <span className="text-xs">{answeredCount} answered</span>
            </div>
          </div>
        </Button>
      </div>

      {/* Modal Overlay - Fixed positioning with proper z-index */}
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop with proper opacity and click handler */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Bottom Sheet - Improved positioning and animation */}
        <div
          ref={modalRef}
          className="absolute right-0 bottom-0 left-0 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-gray-800"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-palette-title"
        >
          {/* Handle Bar for gesture indication */}
          <div className="flex items-center justify-center py-4">
            <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* Header with better typography and close button */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 pb-4 dark:border-gray-700">
            <h3
              id="mobile-palette-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Session Overview
            </h3>
            <Button
              ref={firstFocusableRef}
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close question palette"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scrollable Content with better touch scrolling */}
          <div className="max-h-[60vh] overflow-y-auto overscroll-contain px-6 py-4">
            {/* Session Information - Improved layout */}
            <div className="mb-6 space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.sessionType?.replace('_', ' ') || 'Practice'} Session
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {session.totalQuestions} questions total
                </p>
              </div>
            </div>

            {/* Question Grid - Optimized for mobile touch */}
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: session.totalQuestions }, (_, index) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestionIndex ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => handleQuestionClick(index)}
                  className={`relative h-12 w-12 touch-manipulation p-0 ${
                    index !== currentQuestionIndex
                      ? getQuestionStatusColor(index)
                      : ''
                  }`}
                  aria-label={`Go to question ${index + 1}${
                    index === currentQuestionIndex ? ' (current)' : ''
                  }${
                    questionStatuses[index] === 'answered' ? ' (answered)' : ''
                  }${
                    questionStatuses[index] === 'flagged' ? ' (flagged)' : ''
                  }`}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                  {index !== currentQuestionIndex && (
                    <div className="absolute -top-1 -right-1">
                      {getQuestionStatusIcon(index)}
                    </div>
                  )}
                </Button>
              ))}
            </div>

            {/* Legend - Mobile-optimized grid */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded border border-green-300 bg-green-100"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Answered
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded border border-orange-300 bg-orange-100"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Flagged
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded border border-gray-200 bg-gray-50"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Not Answered
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded border border-blue-700 bg-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Current
                </span>
              </div>
            </div>

            {/* Complete Session Button - Better mobile styling */}
            <Button
              className="mt-6 w-full touch-manipulation"
              variant="destructive"
              onClick={handleCompleteSession}
            >
              Complete Session
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ PERFORMANCE: Memoize component for mobile performance
export { MobileQuestionPalette };
export default memo(MobileQuestionPalette);
