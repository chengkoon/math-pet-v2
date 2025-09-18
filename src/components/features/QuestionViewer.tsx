'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Flag,
  CheckCircle2,
  Bookmark,
  X,
  Clock,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import {
  usePracticeSession,
  usePracticeSessionQuestion,
} from '@/hooks/use-practice';
import { useQuestionMutations } from '@/hooks/useQuestionMutations';
import { withQuestionViewerErrorBoundary } from './QuestionViewerErrorBoundary';

type QuestionStatus = 'unanswered' | 'answered' | 'flagged';

// Improved type safety interfaces
interface McqAnswers {
  [questionIndex: number]: number; // Option index
}

interface ShortAnswers {
  [questionIndex: number]: string; // Answer text
}

interface QuestionStatuses {
  [questionIndex: number]: QuestionStatus;
}

interface QuestionViewerProps {
  sessionId: string;
  onComplete?: () => void;
}

function QuestionViewer({ sessionId, onComplete }: QuestionViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<McqAnswers>({});
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatuses>(
    {}
  );
  const [showMobileQuestionPalette, setShowMobileQuestionPalette] =
    useState(false);
  const [shortAnswers, setShortAnswers] = useState<ShortAnswers>({});

  // API hooks
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = usePracticeSession(sessionId);

  const { data: currentQuestion, isLoading: questionLoading } =
    usePracticeSessionQuestion(sessionId, currentQuestionIndex);

  // Use custom hook for mutations (following coding standards)
  const { submitMcqAnswer, submitShortAnswer, isSubmittingAnswer } =
    useQuestionMutations({
      sessionId,
      currentQuestionIndex,
      setQuestionStatuses,
    });

  const isLoading = sessionLoading || questionLoading;

  // Create stable dependency for questionAttempts
  const questionAttemptsKey = useMemo(() => {
    if (!session?.questionAttempts) return '';
    return JSON.stringify(
      session.questionAttempts.map((attempt) => ({
        questionIndex: attempt.questionIndex,
        isCorrect: attempt.isCorrect,
      }))
    );
  }, [session?.questionAttempts]);

  // Update current question index based on session data
  useEffect(() => {
    if (session?.currentQuestionIndex !== undefined) {
      setCurrentQuestionIndex(session.currentQuestionIndex);
    }
  }, [session?.currentQuestionIndex]);

  // Initialize question statuses based on session attempts
  useEffect(() => {
    if (session?.questionAttempts && session.questionAttempts.length > 0) {
      const statuses: Record<number, QuestionStatus> = {};
      // Use for...of loop to avoid function reference issues
      for (const attempt of session.questionAttempts) {
        if (attempt.questionIndex !== undefined) {
          statuses[attempt.questionIndex] = 'answered';
        }
      }
      setQuestionStatuses(statuses);
    }
  }, [session?.questionAttempts, questionAttemptsKey]); // Include both dependencies

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-16 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-96 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

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

  const progress =
    session.totalQuestions > 0
      ? ((currentQuestionIndex + 1) / session.totalQuestions) * 100
      : 0;

  const handleAnswerSelect = (value: string) => {
    const optionIndex = parseInt(value, 10);
    if (isNaN(optionIndex)) return; // Type safety check

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));

    // Submit the answer using custom hook
    submitMcqAnswer(optionIndex, currentQuestion);
  };

  const handleShortAnswerSubmit = () => {
    const answerText = shortAnswers[currentQuestionIndex] || '';
    submitShortAnswer(answerText, currentQuestion);
  };

  const handleFlagQuestion = () => {
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestionIndex]:
        prev[currentQuestionIndex] === 'flagged' ? 'unanswered' : 'flagged',
    }));
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowMobileQuestionPalette(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < session.totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of session
      if (onComplete) {
        onComplete();
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getQuestionStatusIcon = (index: number) => {
    const status = questionStatuses[index];
    switch (status) {
      case 'answered':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'flagged':
        return <Flag className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getQuestionStatusColor = (index: number) => {
    const status = questionStatuses[index];
    switch (status) {
      case 'answered':
        return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-150';
      case 'flagged':
        return 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-150';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
    }
  };

  const answeredCount =
    Object.keys(selectedAnswers).length +
    Object.keys(shortAnswers).filter((key) =>
      shortAnswers[parseInt(key)]?.trim()
    ).length;

  const isMCQ =
    currentQuestion?.components &&
    currentQuestion.components.some((c) => c.componentType === 'MCQ_OPTION');

  // Format time display (if needed for session time tracking)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile layout - stacked vertically */}
          <div className="block space-y-2 py-3 sm:hidden">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 flex-1 items-center space-x-2">
                <BookOpen className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <h1 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                  {session.packTitle || 'Practice Session'}
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop layout - horizontal */}
          <div className="hidden h-16 items-center justify-between sm:flex">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {session.packTitle || 'Practice Session'}
                </h1>
              </div>
            </div>
            {session.totalTimeSpentSeconds > 0 && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="mr-1 h-4 w-4" />
                Time Spent: {formatTime(session.totalTimeSpentSeconds)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      Question {currentQuestionIndex + 1}
                    </Badge>
                    {currentQuestion?.question?.marks && (
                      <Badge variant="outline">
                        {currentQuestion.question.marks} mark
                        {currentQuestion.question.marks !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {isMCQ && <Badge variant="outline">Multiple Choice</Badge>}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFlagQuestion}
                    className={
                      questionStatuses[currentQuestionIndex] === 'flagged'
                        ? 'text-orange-500'
                        : ''
                    }
                  >
                    <Flag className="mr-1 h-4 w-4" />
                    {questionStatuses[currentQuestionIndex] === 'flagged'
                      ? 'Flagged'
                      : 'Flag'}
                  </Button>
                </div>
                <Progress value={progress} className="mt-2 w-full" />
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Question Text */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-base leading-relaxed">
                    {currentQuestion?.question?.questionText ||
                      'Loading question...'}
                  </p>
                </div>

                {/* MCQ Options */}
                {isMCQ && (
                  <div className="space-y-3">
                    <RadioGroup
                      value={
                        selectedAnswers[currentQuestionIndex]?.toString() || ''
                      }
                      onValueChange={handleAnswerSelect}
                    >
                      {currentQuestion?.components
                        ?.filter(
                          (component) =>
                            component.componentType === 'MCQ_OPTION'
                        )
                        .sort(
                          (a, b) =>
                            (a.componentOrder || 0) - (b.componentOrder || 0)
                        )
                        .map((option, index) => (
                          <div
                            key={option.id || index}
                            className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`option-${index}`}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`option-${index}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  ({option.componentOrder})
                                </span>
                                <div className="text-gray-900 dark:text-white">
                                  {option.isImageOption && option.imageUrl ? (
                                    <Image
                                      src={option.imageUrl}
                                      alt={`Option ${option.componentOrder}`}
                                      width={200}
                                      height={128}
                                      className="max-h-32 object-contain"
                                    />
                                  ) : (
                                    <span>{option.contentText}</span>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Short Answer Area */}
                {!isMCQ && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Answer:
                      </label>
                      <Textarea
                        className="min-h-32 resize-none"
                        placeholder="Write your answer here..."
                        value={shortAnswers[currentQuestionIndex] || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setShortAnswers((prev) => ({
                            ...prev,
                            [currentQuestionIndex]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        className="mt-2"
                        onClick={handleShortAnswerSubmit}
                        disabled={
                          !shortAnswers[currentQuestionIndex]?.trim() ||
                          isSubmittingAnswer
                        }
                      >
                        {isSubmittingAnswer ? 'Submitting...' : 'Submit Answer'}
                      </Button>
                    </div>

                    {/* Working Space */}
                    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Working Space (Optional):
                      </label>
                      <div className="h-40 w-full rounded border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                        {/* This could be enhanced with a drawing canvas or rich text editor */}
                        <div className="bg-dot-pattern h-full w-full opacity-20"></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
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

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Clear answer logic
                    setSelectedAnswers((prev) => {
                      const newAnswers = { ...prev };
                      delete newAnswers[currentQuestionIndex];
                      return newAnswers;
                    });
                    setShortAnswers((prev) => {
                      const newAnswers = { ...prev };
                      delete newAnswers[currentQuestionIndex];
                      return newAnswers;
                    });
                    setQuestionStatuses((prev) => ({
                      ...prev,
                      [currentQuestionIndex]: 'unanswered',
                    }));
                  }}
                >
                  Clear Answer
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    /* Save & bookmark logic */
                  }}
                >
                  <Bookmark className="mr-1 h-4 w-4" />
                  Bookmark
                </Button>
              </div>

              <Button onClick={nextQuestion} disabled={false}>
                {/* Mobile view - show only symbol */}
                <span className="block sm:hidden">
                  <ChevronRight className="h-4 w-4" />
                </span>
                {/* Desktop view - show text with icon */}
                <span className="hidden sm:flex sm:items-center">
                  {currentQuestionIndex >= session.totalQuestions - 1
                    ? 'Complete'
                    : 'Next'}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>

          {/* Question Palette Sidebar - Hidden on Mobile */}
          <div className="hidden lg:col-span-1 lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Session Overview
                </h3>
              </CardHeader>
              <CardContent>
                {/* Session Information */}
                <div className="mb-6 space-y-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.sessionType?.replace('_', ' ')} Session
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {session.totalQuestions} questions total
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                      Progress: {session.questionsAttempted} attempted •{' '}
                      {session.questionsCorrect} correct
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {Array.from(
                    { length: session.totalQuestions },
                    (_, index) => (
                      <Button
                        key={index}
                        variant={
                          index === currentQuestionIndex ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => navigateToQuestion(index)}
                        className={`relative h-10 w-10 p-0 ${
                          index !== currentQuestionIndex
                            ? getQuestionStatusColor(index)
                            : ''
                        }`}
                      >
                        <span className="text-xs font-medium">{index + 1}</span>
                        {index !== currentQuestionIndex && (
                          <div className="absolute -top-1 -right-1">
                            {getQuestionStatusIcon(index)}
                          </div>
                        )}
                      </Button>
                    )
                  )}
                </div>

                {/* Legend */}
                <div className="mt-6 space-y-2 text-xs">
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

                {/* Complete Session Button */}
                <Button
                  className="mt-6 w-full"
                  variant="destructive"
                  onClick={() => {
                    if (onComplete) {
                      onComplete();
                    }
                  }}
                >
                  Complete Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Question Palette - Unified Floating Action Button */}
      <div className="fixed right-4 bottom-4 z-20 lg:hidden">
        <Button
          onClick={() => setShowMobileQuestionPalette(true)}
          className="h-auto min-w-0 rounded-2xl bg-blue-600 px-4 py-3 shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
          size="sm"
        >
          <div className="flex flex-col items-center space-y-1 text-white">
            {/* Progress and current question */}
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

      {/* Mobile Question Palette - Bottom Sheet Modal */}
      {showMobileQuestionPalette && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="bg-opacity-50 absolute inset-0 bg-black"
            onClick={() => setShowMobileQuestionPalette(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute right-0 bottom-0 left-0 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white dark:bg-gray-800">
            {/* Handle Bar */}
            <div className="flex items-center justify-center py-4">
              <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 pb-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Session Overview
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileQuestionPalette(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content - Scrollable */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              {/* Session Information */}
              <div className="mb-6 space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.sessionType?.replace('_', ' ')} Session
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {session.totalQuestions} questions total
                  </p>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: session.totalQuestions }, (_, index) => (
                  <Button
                    key={index}
                    variant={
                      index === currentQuestionIndex ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => navigateToQuestion(index)}
                    className={`relative h-12 w-12 p-0 ${
                      index !== currentQuestionIndex
                        ? getQuestionStatusColor(index)
                        : ''
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

              {/* Legend */}
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

              {/* Complete Session Button */}
              <Button
                className="mt-6 w-full"
                variant="destructive"
                onClick={() => {
                  setShowMobileQuestionPalette(false);
                  if (onComplete) {
                    onComplete();
                  }
                }}
              >
                Complete Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with error boundary wrapper for better error handling
export default withQuestionViewerErrorBoundary(QuestionViewer);
