// src/app/questionviewer/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Flag,
  CheckCircle2,
  Bookmark,
  Grid3X3,
  X,
} from 'lucide-react';

// Hardcoded test data matching your database structure
const mockQuestionData = {
  examInfo: {
    title: 'Primary 6 Mathematics Practice Paper',
    totalQuestions: 30,
    totalMarks: 50,
    duration: 90, // minutes
    sections: [
      { name: 'Section A: Multiple Choice', questions: '1-20', marks: 20 },
      { name: 'Section B: Short Answer', questions: '21-30', marks: 30 },
    ],
  },
  questions: [
    // MCQ Question
    {
      questionIndex: 0,
      question: {
        id: 6,
        questionTypeId: 1,
        subjectId: 1,
        levelId: 6,
        curriculumTopicIds: [],
        questionText:
          'The average of 3 numbers is 34. One of the numbers is 28. Which of the following are the other two numbers?',
        marks: 1.0,
        workingMarks: 0.0,
        createdBy: '00000000-0000-0000-0000-000000000001',
        isPublic: null,
        createdAt: 1756152462.588588,
        updatedAt: 1756152462.588588,
      },
      components: [
        {
          id: 22,
          componentType: 'MCQ_OPTION',
          componentOrder: 1,
          marksAllocated: null,
          contentText: '42, 54',
          imageUrl: null,
          isImageOption: false,
        },
        {
          id: 23,
          componentType: 'MCQ_OPTION',
          componentOrder: 2,
          marksAllocated: null,
          contentText: '36, 38',
          imageUrl: null,
          isImageOption: false,
        },
        {
          id: 24,
          componentType: 'MCQ_OPTION',
          componentOrder: 3,
          marksAllocated: null,
          contentText: '30, 32',
          imageUrl: null,
          isImageOption: false,
        },
        {
          id: 25,
          componentType: 'MCQ_OPTION',
          componentOrder: 4,
          marksAllocated: null,
          contentText: '24, 26',
          imageUrl: null,
          isImageOption: false,
        },
      ],
    },
    // Short Answer Question
    {
      questionIndex: 1,
      question: {
        id: 40,
        questionTypeId: 3,
        subjectId: 1,
        levelId: 6,
        curriculumTopicIds: [],
        questionText:
          'Zhi Xiang went to a shop to buy a bag. The shop gave a discount of $5 for every $25 spent. Zhi Xiang paid $96 for a bag. What was the price of the bag before the discount?',
        marks: 2.0,
        workingMarks: 0.0,
        createdBy: '00000000-0000-0000-0000-000000000001',
        isPublic: null,
        createdAt: 1756152462.588588,
        updatedAt: 1756152462.588588,
      },
      components: [],
    },
    // Image-based MCQ Question
    {
      questionIndex: 2,
      question: {
        id: 41,
        questionTypeId: 1,
        subjectId: 1,
        levelId: 6,
        curriculumTopicIds: [],
        questionText:
          "Singapore's population was 6,014,723 last year. Express this number to the nearest thousand.",
        marks: 1.0,
        workingMarks: 0.0,
        createdBy: '00000000-0000-0000-0000-000000000001',
        isPublic: null,
        createdAt: 1756152462.588588,
        updatedAt: 1756152462.588588,
      },
      components: [
        {
          id: 26,
          componentType: 'MCQ_OPTION',
          componentOrder: 1,
          marksAllocated: null,
          contentText: '6,000,000',
          imageUrl: null,
          isImageOption: false,
        },
        {
          id: 27,
          componentType: 'MCQ_OPTION',
          componentOrder: 2,
          marksAllocated: null,
          contentText: '6,010,000',
          imageUrl: null,
          isImageOption: false,
        },
        {
          id: 28,
          componentType: 'MCQ_OPTION',
          componentOrder: 3,
          marksAllocated: null,
          contentText: '6,014,000',
          imageUrl: null,
          isImageOption: false,
        },
        {
          id: 29,
          componentType: 'MCQ_OPTION',
          componentOrder: 4,
          marksAllocated: null,
          contentText: '6,015,000',
          imageUrl: null,
          isImageOption: false,
        },
      ],
    },
  ],
};

type QuestionStatus = 'unanswered' | 'answered' | 'flagged';

export default function QuestionViewer() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string | number>
  >({});
  const [questionStatuses, setQuestionStatuses] = useState<
    Record<number, QuestionStatus>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [showMobileQuestionPalette, setShowMobileQuestionPalette] =
    useState(false);

  const currentQuestion = mockQuestionData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / mockQuestionData.examInfo.totalQuestions) *
    100;

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));

    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestionIndex]: 'answered',
    }));
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
    if (currentQuestionIndex < mockQuestionData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
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

  const isMCQ =
    currentQuestion?.components && currentQuestion.components.length > 0;

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
                  {mockQuestionData.examInfo.title}
                </h1>
              </div>
              <div className="ml-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Desktop layout - horizontal */}
          <div className="hidden h-16 items-center justify-between sm:flex">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {mockQuestionData.examInfo.title}
                </h1>
              </div>
            </div>
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
                    <Badge variant="outline">
                      {currentQuestion?.question.marks} mark
                      {currentQuestion?.question.marks !== 1 ? 's' : ''}
                    </Badge>
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
                    {currentQuestion?.question.questionText}
                  </p>
                </div>

                {/* MCQ Options */}
                {isMCQ && (
                  <div className="space-y-3">
                    {currentQuestion.components.map((option, index) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-start space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={index}
                          checked={
                            selectedAnswers[currentQuestionIndex] === index
                          }
                          onChange={() => handleAnswerSelect(index)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              ({option.componentOrder})
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {option.contentText}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Short Answer Area */}
                {!isMCQ && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Answer:
                      </label>
                      <textarea
                        className="h-32 w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Write your answer here..."
                        value={
                          (selectedAnswers[currentQuestionIndex] as string) ||
                          ''
                        }
                        onChange={(e) =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [currentQuestionIndex]: e.target.value,
                          }))
                        }
                      />
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
                    /* Clear answer logic */
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

              <Button
                onClick={nextQuestion}
                disabled={
                  currentQuestionIndex === mockQuestionData.questions.length - 1
                }
              >
                {/* Mobile view - show only symbol */}
                <span className="block sm:hidden">
                  <ChevronRight className="h-4 w-4" />
                </span>
                {/* Desktop view - show text with icon */}
                <span className="hidden sm:flex sm:items-center">
                  Next
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
                  Paper Overview
                </h3>
              </CardHeader>
              <CardContent>
                {/* Section Information */}
                <div className="mb-6 space-y-4">
                  {mockQuestionData.examInfo.sections.map((section, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {section.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Questions {section.questions} • {section.marks} marks
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {Array.from(
                    { length: mockQuestionData.examInfo.totalQuestions },
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

                {/* Submit Button */}
                <Button className="mt-6 w-full" variant="destructive">
                  Submit Exam
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Question Palette - Unified Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-20 lg:hidden">
        <Button
          onClick={() => setShowMobileQuestionPalette(true)}
          className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-blue-600 p-2 shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          size="sm"
        >
          <span className="text-xs leading-none font-bold text-white">
            {currentQuestionIndex + 1}/
            {mockQuestionData.examInfo.totalQuestions}
          </span>
          <Grid3X3 className="mt-1 h-4 w-4 text-white" />
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
                Paper Overview
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
              {/* Section Information */}
              <div className="mb-6 space-y-3">
                {mockQuestionData.examInfo.sections.map((section, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {section.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Questions {section.questions} • {section.marks} marks
                    </p>
                  </div>
                ))}
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-6 gap-3">
                {Array.from(
                  { length: mockQuestionData.examInfo.totalQuestions },
                  (_, index) => (
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
                  )
                )}
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

              {/* Submit Button */}
              <Button className="mt-6 w-full" variant="destructive">
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
