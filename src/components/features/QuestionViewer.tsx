'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
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
    workingSteps,
    questionStatuses,
    showMobilePalette,
    answeredCount,
    isCurrentQuestionAnswered,
    navigation,
    answers,
    status,
    setQuestionStatuses, // Add this line to get the setState function
  } = useQuestionViewerState({ session, sessionId });

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
  const { submitAnswer, isSubmittingAnswer } = useQuestionMutations({
    sessionId,
    currentQuestionIndex,
    workingSteps: workingSteps[currentQuestionIndex] || [],
    setQuestionStatuses,
  });

  // Handle MCQ answer selection (without submission)
  const handleMcqAnswerChange = (optionIndex: number) => {
    answers.updateMcqAnswer(currentQuestionIndex, optionIndex);
  };

  // Handle check answer - submit the currently selected answer
  const handleCheckAnswer = () => {
    const currentMcqAnswer = mcqAnswers[currentQuestionIndex];
    const currentShortAnswer = shortAnswers[currentQuestionIndex];

    if (currentMcqAnswer !== undefined) {
      // Submit MCQ answer
      submitAnswer({
        optionIndex: currentMcqAnswer,
        question: currentQuestion,
      });
    } else if (currentShortAnswer?.trim()) {
      // Submit short answer
      submitAnswer({
        answerText: currentShortAnswer,
        question: currentQuestion,
      });
    } else {
      // No answer selected, show toast
      toast.warning('Please select an answer before checking.');
    }
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
      <div className="sticky top-12 z-40 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Left: Back navigation with breadcrumb */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                {session.packTitle}
              </div>
            </div>

            {/* Right: Progress indicator */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="hidden text-gray-600 sm:block dark:text-gray-400">
                {currentQuestionIndex + 1} of {session.totalQuestions}
              </div>
              <div className="h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-1.5 rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / session.totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
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
                  workingSteps={workingSteps[currentQuestionIndex] || []}
                  questionStatus={questionStatuses[currentQuestionIndex]}
                  isSubmittingAnswer={isSubmittingAnswer}
                  isQuestionAnswered={isCurrentQuestionAnswered}
                  onMcqAnswerChange={handleMcqAnswerChange}
                  onShortAnswerChange={(answer) =>
                    answers.updateShortAnswer(currentQuestionIndex, answer)
                  }
                  onWorkingStepsChange={(steps) =>
                    answers.updateWorkingSteps(currentQuestionIndex, steps)
                  }
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
                  hasAnswer={
                    mcqAnswers[currentQuestionIndex] !== undefined ||
                    (shortAnswers[currentQuestionIndex]?.trim().length ?? 0) > 0
                  }
                  isSubmittingAnswer={isSubmittingAnswer}
                  onPrevious={navigation.previousQuestion}
                  onNext={navigation.nextQuestion}
                  onCheckAnswer={handleCheckAnswer}
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
