'use client';

import { use } from 'react';
import {
  usePracticeSession,
  usePracticeSessionQuestion,
} from '@/hooks/use-practice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface SessionPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = usePracticeSession(sessionId);
  const { data: currentQuestion, isLoading: questionLoading } =
    usePracticeSessionQuestion(sessionId, currentQuestionIndex);

  const isLoading = sessionLoading || questionLoading;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Session Not Found
          </h1>
          <p className="text-red-600 dark:text-red-400">
            Unable to load practice session. The session may not exist or there
            was an error loading it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pack
      </Button>

      <div className="space-y-6">
        {/* Session Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Practice Session
                </CardTitle>
                <CardDescription>Session ID: {session.id}</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                {session.status && (
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {session.status}
                    </span>
                  </div>
                )}
                {session.startedAt && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="mr-1 h-4 w-4" />
                    Started: {new Date(session.startedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          {session.totalQuestions && (
            <CardContent>
              <div className="flex justify-between text-sm">
                <span>Progress:</span>
                <span>
                  Question {currentQuestionIndex + 1} of{' '}
                  {session.totalQuestions}
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / session.totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Current Question */}
        {currentQuestion ? (
          <Card>
            <CardHeader>
              <CardTitle>
                Question {currentQuestionIndex + 1}
                {currentQuestion.question?.marks && (
                  <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                    ({currentQuestion.question.marks} marks)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentQuestion.question?.questionText && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{currentQuestion.question.questionText}</p>
                  </div>
                )}

                {/* Display question components (including MCQ options) */}
                {currentQuestion.components &&
                  currentQuestion.components.length > 0 && (
                    <div className="space-y-2">
                      {currentQuestion.components
                        .filter(
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
                            className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <input
                              type="radio"
                              id={`option-${index}`}
                              name="mcq-answer"
                              className="h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor={`option-${index}`}
                              className="flex-1 cursor-pointer text-sm"
                            >
                              {option.isImageOption && option.imageUrl ? (
                                <Image
                                  src={option.imageUrl}
                                  alt={`Option ${index + 1}`}
                                  width={200}
                                  height={128}
                                  className="max-h-32 object-contain"
                                />
                              ) : (
                                option.contentText
                              )}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}

                {/* Show textarea for non-MCQ questions or if no MCQ options are found */}
                {(!currentQuestion.components ||
                  !currentQuestion.components.some(
                    (c) => c.componentType === 'MCQ_OPTION'
                  )) && (
                  <div>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                      rows={4}
                      placeholder="Enter your answer here..."
                    />
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    disabled={currentQuestionIndex === 0}
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    }
                  >
                    Previous
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline">Skip</Button>
                    <Button
                      onClick={() => {
                        if (
                          session.totalQuestions &&
                          currentQuestionIndex < session.totalQuestions - 1
                        ) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else if (!session.totalQuestions) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        }
                      }}
                      disabled={
                        session.totalQuestions
                          ? currentQuestionIndex >= session.totalQuestions - 1
                          : false
                      }
                    >
                      {session.totalQuestions
                        ? currentQuestionIndex >= session.totalQuestions - 1
                          ? 'Complete'
                          : 'Next'
                        : 'Next'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                No Questions Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This practice session doesn&apos;t have any questions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
