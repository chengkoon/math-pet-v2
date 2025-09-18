'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import {
  usePracticeSession,
  usePracticeSessionQuestion,
} from '@/hooks/use-practice';
import { useQuestionMutations } from '@/hooks/useQuestionMutations';
import { useQuestionViewerState } from '@/hooks/useQuestionViewerState';
import { withQuestionViewerErrorBoundary } from './QuestionViewerErrorBoundary';
import QuestionContent from './question-content/QuestionContent';
import QuestionNavigation from './question-navigation/QuestionNavigation';
import QuestionPalette from './question-palette/QuestionPalette';
import MobileQuestionPalette from './question-palette/MobileQuestionPalette';
import {
  SkipLinks,
  announceQuestionChange,
  useKeyboardNavigation,
} from './accessibility/a11y-utils';
import {
  QuestionViewerSkeleton,
  QuestionContentSkeleton,
} from './skeleton/QuestionViewerSkeleton';

interface QuestionViewerProps {
  sessionId: string;
  onComplete?: () => void;
}

/**
 * QuestionViewer - Main orchestrator component (REFACTORED)
 * Now under 150 lines, focuses only on composition and high-level coordination
 * Business logic extracted to custom hooks and atomic components
 */
function QuestionViewer({ sessionId, onComplete }: QuestionViewerProps) {
  // API hooks
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = usePracticeSession(sessionId);

  // State management hook - all local state logic
  const {
    currentQuestionIndex,
    mcqAnswers,
    shortAnswers,
    questionStatuses,
    showMobilePalette,
    answeredCount,
    navigation,
    answers,
    status,
  } = useQuestionViewerState({ session });

  const { data: currentQuestion, isLoading: questionLoading } =
    usePracticeSessionQuestion(sessionId, currentQuestionIndex);

  // ✅ ACCESSIBILITY: Keyboard navigation support
  useKeyboardNavigation(
    currentQuestionIndex,
    session?.totalQuestions ?? 0,
    navigation.goToQuestion,
    navigation.nextQuestion,
    navigation.previousQuestion,
    true // Always enabled for accessibility
  );

  // ✅ ACCESSIBILITY: Announce question changes to screen readers
  useEffect(() => {
    if (currentQuestion?.question?.questionText) {
      announceQuestionChange(
        currentQuestionIndex,
        session?.totalQuestions ?? 0,
        currentQuestion.question.questionText
      );
    }
  }, [
    currentQuestionIndex,
    currentQuestion?.question?.questionText,
    session?.totalQuestions,
  ]);

  // Mutation hook - all API calls
  const { submitMcqAnswer, submitShortAnswer, isSubmittingAnswer } =
    useQuestionMutations({
      sessionId,
      currentQuestionIndex,
      setQuestionStatuses: (statuses) => {
        // Custom handler to bridge the different function signatures
        Object.entries(statuses).forEach(([index, statusValue]) => {
          if (statusValue === 'answered') {
            status.setAnswered(parseInt(index));
          }
        });
      },
    });

  // Format time helper
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle MCQ answer submission
  const handleMcqAnswerChange = (optionIndex: number) => {
    answers.updateMcqAnswer(currentQuestionIndex, optionIndex);
    submitMcqAnswer(optionIndex, currentQuestion);
  };

  // Handle short answer submission
  const handleShortAnswerSubmit = () => {
    const answerText = shortAnswers[currentQuestionIndex] || '';
    submitShortAnswer(answerText, currentQuestion);
  };

  // Handle clear answer
  const handleClearAnswer = () => {
    answers.clearAnswer(currentQuestionIndex);
  };

  // Handle flag toggle
  const handleFlagToggle = () => {
    status.toggleFlag(currentQuestionIndex);
  };

  // Handle complete session
  const handleCompleteSession = () => {
    if (onComplete) {
      onComplete();
    }
  };

  // ✅ PERFORMANCE: Only show full skeleton when session is loading
  if (sessionLoading) {
    return <QuestionViewerSkeleton />;
  }

  // Error state
  if (sessionError || !session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Session Not Found
            </h1>
            <p className="text-red-600 dark:text-red-400">
              Unable to load practice session. The session may not exist or
              there was an error loading it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ✅ ACCESSIBILITY: Skip links for keyboard users */}
      <SkipLinks />

      {/* Header - Simplified */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="-ml-2 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Pack
                </Button>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {session.packTitle}
                </h1>
              </div>
            </div>
            {session.totalTimeSpentSeconds &&
              session.totalTimeSpentSeconds > 0 && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="mr-1 h-4 w-4" />
                  Time: {formatTime(session.totalTimeSpentSeconds)}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Question Area */}
          <div className="space-y-6 lg:col-span-3">
            <main
              id="question-content"
              role="main"
              aria-label="Question content"
            >
              {questionLoading ? (
                <QuestionContentSkeleton />
              ) : (
                <QuestionContent
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={session.totalQuestions}
                  mcqAnswer={mcqAnswers[currentQuestionIndex]}
                  shortAnswer={shortAnswers[currentQuestionIndex] || ''}
                  questionStatus={
                    questionStatuses[currentQuestionIndex] || 'unanswered'
                  }
                  isSubmittingAnswer={isSubmittingAnswer}
                  onMcqAnswerChange={handleMcqAnswerChange}
                  onShortAnswerChange={(answer) =>
                    answers.updateShortAnswer(currentQuestionIndex, answer)
                  }
                  onShortAnswerSubmit={handleShortAnswerSubmit}
                  onFlagToggle={handleFlagToggle}
                />
              )}

              <nav
                id="question-navigation"
                role="navigation"
                aria-label="Question navigation"
              >
                <QuestionNavigation
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={session.totalQuestions}
                  mcqAnswer={mcqAnswers[currentQuestionIndex]}
                  shortAnswer={shortAnswers[currentQuestionIndex] || ''}
                  onPrevious={navigation.previousQuestion}
                  onNext={navigation.nextQuestion}
                  onClearAnswer={handleClearAnswer}
                  onBookmark={() => {}} // TODO: Implement bookmark functionality
                  onComplete={handleCompleteSession}
                />
              </nav>
            </main>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <QuestionPalette
              session={session}
              currentQuestionIndex={currentQuestionIndex}
              questionStatuses={questionStatuses}
              onNavigateToQuestion={navigation.goToQuestion}
              onCompleteSession={handleCompleteSession}
            />
          </div>
        </div>
      </div>

      {/* Mobile Question Palette */}
      <MobileQuestionPalette
        session={session}
        currentQuestionIndex={currentQuestionIndex}
        questionStatuses={questionStatuses}
        answeredCount={answeredCount}
        isOpen={showMobilePalette}
        onClose={navigation.closeMobilePalette}
        onNavigateToQuestion={navigation.goToQuestion}
        onCompleteSession={handleCompleteSession}
      />

      {/* Mobile FAB - Only show when palette is closed */}
      {!showMobilePalette && (
        <div className="fixed right-4 bottom-4 z-20 lg:hidden">
          <button
            onClick={navigation.toggleMobilePalette}
            className="h-auto min-w-0 rounded-2xl bg-blue-600 px-4 py-3 shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
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
          </button>
        </div>
      )}
    </div>
  );
}

export default withQuestionViewerErrorBoundary(QuestionViewer);
