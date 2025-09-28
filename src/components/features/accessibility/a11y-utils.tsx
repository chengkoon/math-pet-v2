/**
 * Accessibility utilities for question viewer components
 *
 * ✅ WCAG AA Compliance Features:
 * - Proper ARIA labels and roles
 * - Keyboard navigation support
 * - Screen reader announcements
 * - Focus management
 * - High contrast support
 */

import { useEffect, useRef, useCallback } from 'react';

// ARIA labels for question statuses
export const getQuestionAriaLabel = (
  questionIndex: number,
  status: 'unanswered' | 'answered' | 'flagged',
  isCurrent: boolean
): string => {
  const questionNumber = questionIndex + 1;
  const statusText =
    status === 'answered'
      ? 'answered'
      : status === 'flagged'
        ? 'flagged for review'
        : 'not answered';
  const currentText = isCurrent ? ', currently selected' : '';

  return `Question ${questionNumber}, ${statusText}${currentText}`;
};

// Announce question changes to screen readers
export const announceQuestionChange = (
  questionIndex: number | undefined,
  totalQuestions: number,
  questionText?: string
): void => {
  const announcement = `Question ${questionIndex !== undefined ? questionIndex + 1 : 0} of ${totalQuestions}. ${
    questionText
      ? `Question text: ${questionText.substring(0, 100)}${questionText.length > 100 ? '...' : ''}`
      : ''
  }`;

  // Create live region for screen reader announcements
  const announcer =
    document.getElementById('question-announcer') ||
    (() => {
      const el = document.createElement('div');
      el.id = 'question-announcer';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.className = 'sr-only';
      document.body.appendChild(el);
      return el;
    })();

  // Clear and set new announcement
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = announcement;
  }, 100);
};

// Keyboard navigation hook
export const useKeyboardNavigation = (
  currentIndex: number,
  totalQuestions: number,
  onNavigate: (index: number) => void,
  onNext: () => void,
  onPrevious: () => void,
  isEnabled: boolean = true
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isEnabled) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          onNext();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          onPrevious();
          break;

        case 'Home':
          e.preventDefault();
          onNavigate(0);
          break;

        case 'End':
          e.preventDefault();
          onNavigate(totalQuestions - 1);
          break;

        case 'PageDown':
          e.preventDefault();
          onNavigate(Math.min(currentIndex + 10, totalQuestions - 1));
          break;

        case 'PageUp':
          e.preventDefault();
          onNavigate(Math.max(currentIndex - 10, 0));
          break;
      }
    },
    [currentIndex, totalQuestions, onNavigate, onNext, onPrevious, isEnabled]
  );

  useEffect(() => {
    if (isEnabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [handleKeyDown, isEnabled]);
};

// Focus management hook
export const useFocusManagement = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const captureFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus();
    }
  }, []);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element && element.focus) {
      element.focus();
    }
  }, []);

  return { captureFocus, restoreFocus, focusElement };
};

// Skip links for keyboard users
export const SkipLinks = () => (
  <div className="sr-only focus:not-sr-only">
    <a
      href="#question-content"
      className="absolute top-4 left-4 z-50 rounded bg-blue-600 px-4 py-2 text-white focus:ring-2 focus:ring-blue-300"
    >
      Skip to question content
    </a>
    <a
      href="#question-navigation"
      className="absolute top-4 left-32 z-50 rounded bg-blue-600 px-4 py-2 text-white focus:ring-2 focus:ring-blue-300"
    >
      Skip to navigation
    </a>
  </div>
);

// High contrast detection
export const useHighContrast = () => {
  const isHighContrast =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-contrast: high)').matches;

  return { isHighContrast };
};

// Screen reader only text utility
export const ScreenReaderOnly = ({
  children,
}: {
  children: React.ReactNode;
}) => <span className="sr-only">{children}</span>;
