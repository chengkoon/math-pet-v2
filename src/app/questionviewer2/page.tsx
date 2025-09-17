'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  showCorrectAnswerToast,
  showWrongAnswerToast,
} from '@/components/ui/educational-toast';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Flag,
  Bookmark,
  Clock,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Type definitions based on your API types
interface QuestionComponent {
  id: number;
  componentType: 'MCQ_OPTION';
  componentOrder: number;
  contentText: string;
}

interface Question {
  id: number;
  questionTypeId: number; // 1 = MCQ, 3 = Short Answer
  questionText: string;
  marks: number;
  subjectId?: number;
  levelId?: number;
  components?: QuestionComponent[];
}

interface QuestionWithComponents {
  questionIndex: number;
  question: Question;
  components: QuestionComponent[];
}

type QuestionStatus = 'unanswered' | 'answered' | 'flagged' | 'current';

// Mock data for demonstration
const mockQuestions: QuestionWithComponents[] = Array.from(
  { length: 30 },
  (_, i) => ({
    questionIndex: i,
    question: {
      id: i + 1,
      questionTypeId: i % 4 === 0 ? 3 : 1, // Every 4th question is short answer
      questionText:
        i % 4 === 0
          ? `Explain the mathematical concept behind this problem. Show your working clearly. (Question ${i + 1})`
          : `Which of the following represents the correct solution to this mathematical problem? (Question ${i + 1})`,
      marks: i % 4 === 0 ? 5 : 2,
    },
    components:
      i % 4 === 0
        ? []
        : [
            {
              id: i * 4 + 1,
              componentType: 'MCQ_OPTION',
              componentOrder: 1,
              contentText: 'Option A: Mathematical solution 1',
            },
            {
              id: i * 4 + 2,
              componentType: 'MCQ_OPTION',
              componentOrder: 2,
              contentText: 'Option B: Mathematical solution 2',
            },
            {
              id: i * 4 + 3,
              componentType: 'MCQ_OPTION',
              componentOrder: 3,
              contentText: 'Option C: Mathematical solution 3',
            },
            {
              id: i * 4 + 4,
              componentType: 'MCQ_OPTION',
              componentOrder: 4,
              contentText: 'Option D: Mathematical solution 4',
            },
          ],
  })
);

export default function QuestionViewer() {
  // Core state management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string | number>
  >({});
  const [questionStatuses, setQuestionStatuses] = useState<
    Record<number, QuestionStatus>
  >({});
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const totalQuestions = mockQuestions.length;
  const isMCQ = currentQuestion.question.questionTypeId === 1;
  const isShortAnswer = currentQuestion.question.questionTypeId === 3;

  // Timer functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Update question status based on answers
  useEffect(() => {
    const newStatuses: Record<number, QuestionStatus> = {};

    mockQuestions.forEach((_, index) => {
      if (index === currentQuestionIndex) {
        newStatuses[index] = 'current';
      } else if (flaggedQuestions.has(index)) {
        newStatuses[index] = 'flagged';
      } else if (selectedAnswers[index] !== undefined) {
        newStatuses[index] = 'answered';
      } else {
        newStatuses[index] = 'unanswered';
      }
    });

    setQuestionStatuses(newStatuses);
  }, [currentQuestionIndex, selectedAnswers, flaggedQuestions]);

  // Navigation functions
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentQuestionIndex(index);
        setShowQuestionPalette(false); // Close mobile palette
      }
    },
    [totalQuestions]
  );

  const goToPrevious = () => goToQuestion(currentQuestionIndex - 1);
  const goToNext = () => goToQuestion(currentQuestionIndex + 1);

  // Answer handling
  const handleMCQAnswer = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleShortAnswer = (text: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: text,
    }));
  };

  const clearAnswer = () => {
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestionIndex];
      return newAnswers;
    });
  };

  // Flag/bookmark functions
  const toggleFlag = () => {
    showWrongAnswerToast();
    toast('test test');
    setFlaggedQuestions((prev) => {
      const newFlags = new Set(prev);
      if (newFlags.has(currentQuestionIndex)) {
        newFlags.delete(currentQuestionIndex);
      } else {
        newFlags.add(currentQuestionIndex);
      }
      return newFlags;
    });
  };

  const toggleBookmark = () => {
    setBookmarkedQuestions((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(currentQuestionIndex)) {
        newBookmarks.delete(currentQuestionIndex);
      } else {
        newBookmarks.add(currentQuestionIndex);
      }
      return newBookmarks;
    });
  };

  // Calculate progress
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  // Status colors for question palette
  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white';
      case 'answered':
        return 'bg-green-500 text-white';
      case 'flagged':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Question Palette Component
  const QuestionPalette = ({ className = '' }: { className?: string }) => (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Question Overview</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Section A: Questions 1-20</p>
          <p>20 marks</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-6 gap-2">
        {mockQuestions.map((_, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={cn(
              'h-10 w-10 p-0 text-sm font-medium',
              getStatusColor(questionStatuses[index] || 'unanswered')
            )}
            onClick={() => goToQuestion(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-500"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-orange-500"></div>
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-500"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <span>Unanswered</span>
        </div>
      </div>

      <Separator />

      <Button className="w-full" size="lg">
        Submit Exam
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="truncate text-lg font-semibold">
              Mathematics Exam 2024
            </h1>
            <Badge variant="outline">{`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}</Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowQuestionPalette(true)}
            >
              <Menu className="h-4 w-4" />
              <span className="ml-1">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Question Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Question Header */}
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">
                    Question {currentQuestionIndex + 1}
                  </Badge>
                  <Badge variant="outline">
                    {currentQuestion.question.marks} mark
                    {currentQuestion.question.marks !== 1 ? 's' : ''}
                  </Badge>
                  <Badge variant={isMCQ ? 'default' : 'secondary'}>
                    {isMCQ ? 'MCQ' : 'Short Answer'}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFlag}
                    className={cn(
                      flaggedQuestions.has(currentQuestionIndex) &&
                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                    )}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleBookmark}
                    className={cn(
                      bookmarkedQuestions.has(currentQuestionIndex) &&
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    )}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Progress value={progressPercentage} className="h-2" />
              <p className="mt-1 text-xs text-gray-500">
                {answeredCount} of {totalQuestions} questions answered
              </p>
            </Card>

            {/* Question Content */}
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg leading-relaxed font-medium">
                    {currentQuestion.question.questionText}
                  </h2>
                </div>

                {/* MCQ Options */}
                {isMCQ && currentQuestion.components && (
                  <div className="space-y-3">
                    {currentQuestion.components
                      .sort((a, b) => a.componentOrder - b.componentOrder)
                      .map((option, index) => (
                        <label
                          key={option.id}
                          className="flex cursor-pointer items-start space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            checked={
                              selectedAnswers[currentQuestionIndex] === index
                            }
                            onChange={() => handleMCQAnswer(index)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <span className="font-medium">({index + 1})</span>
                            <span className="ml-2">{option.contentText}</span>
                          </div>
                        </label>
                      ))}
                  </div>
                )}

                {/* Short Answer */}
                {isShortAnswer && (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Enter your answer here..."
                      value={
                        (selectedAnswers[currentQuestionIndex] as string) || ''
                      }
                      onChange={(e) => handleShortAnswer(e.target.value)}
                      className="h-32 w-full resize-none rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                    />
                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Working Space (optional):
                      </p>
                      <textarea
                        placeholder="Show your working here..."
                        className="h-24 w-full resize-none rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={clearAnswer}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Clear Answer
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleBookmark}
                  className={cn(
                    bookmarkedQuestions.has(currentQuestionIndex) &&
                      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  )}
                >
                  <Bookmark className="mr-1 h-4 w-4" />
                  Bookmark
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={goToNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>

        {/* Desktop Question Palette */}
        <aside className="hidden w-80 overflow-y-auto border-l border-gray-200 bg-white p-4 lg:block dark:border-gray-700 dark:bg-gray-800">
          <QuestionPalette />
        </aside>
      </div>

      {/* Mobile Question Palette Modal */}
      {showQuestionPalette && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="bg-opacity-50 fixed inset-0 bg-black"
            onClick={() => setShowQuestionPalette(false)}
          />
          <div className="fixed inset-x-4 top-4 bottom-4 overflow-y-auto rounded-lg bg-white p-4 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Question Overview</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuestionPalette(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <QuestionPalette />
          </div>
        </div>
      )}
    </div>
  );
}
