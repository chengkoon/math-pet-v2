'use client';

import { useCallback, useMemo, memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Flag } from 'lucide-react';
import Image from 'next/image';
import { WorkingSteps } from '../working-steps/WorkingSteps';
import type {
  PracticeQuestionResponse,
  QuestionAttemptResponseStatusEnum,
} from '@chengkoon/mathpet-api-types';

interface QuestionContentProps {
  question: PracticeQuestionResponse | undefined;
  questionIndex: number;
  totalQuestions: number;
  mcqAnswer: number | undefined;
  shortAnswer: string;
  workingSteps: string[];
  questionStatus: QuestionAttemptResponseStatusEnum | undefined;
  isSubmittingAnswer: boolean;
  isQuestionAnswered: boolean;
  onMcqAnswerChange: (optionIndex: number) => void;
  onShortAnswerChange: (answer: string) => void;
  onWorkingStepsChange: (steps: string[]) => void;
  onFlagToggle: () => void;
}

/**
 * QuestionContent - Atomic component for question display (OPTIMIZED)
 * Handles MCQ options, short answer input, and question text rendering
 * Uses React.memo to prevent unnecessary re-renders
 * Memoizes expensive operations for performance
 */
const QuestionContent = ({
  question,
  questionIndex,
  totalQuestions,
  mcqAnswer,
  shortAnswer,
  workingSteps,
  questionStatus,
  isSubmittingAnswer,
  isQuestionAnswered,
  onMcqAnswerChange,
  onShortAnswerChange,
  onWorkingStepsChange,
  onFlagToggle,
}: QuestionContentProps) => {
  // ✅ PERFORMANCE: Memoize expensive MCQ options calculation
  const mcqOptions = useMemo(() => {
    return (
      question?.components
        ?.filter((component) => component.componentType === 'MCQ_OPTION')
        .sort((a, b) => (a.componentOrder ?? 0) - (b.componentOrder ?? 0)) ?? []
    );
  }, [question?.components]);

  // ✅ PERFORMANCE: Memoize isMCQ calculation
  const isMCQ = useMemo(() => {
    return Boolean(
      question?.components?.some((c) => c.componentType === 'MCQ_OPTION')
    );
  }, [question?.components]);

  // ✅ PERFORMANCE: Memoize progress calculation
  const progress = useMemo(() => {
    return totalQuestions > 0
      ? ((questionIndex + 1) / totalQuestions) * 100
      : 0;
  }, [questionIndex, totalQuestions]);

  // Handle MCQ selection with proper type safety - MUST be called unconditionally
  const handleMcqSelect = useCallback(
    (optionId: string) => {
      // Don't allow changes if question is already answered
      if (isQuestionAnswered) return;
      onMcqAnswerChange(+optionId);
    },
    [onMcqAnswerChange, isQuestionAnswered]
  );

  // Handle textarea change - MUST be called unconditionally
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Don't allow changes if question is already answered
      if (isQuestionAnswered) return;

      onShortAnswerChange(e.target.value);
    },
    [onShortAnswerChange, isQuestionAnswered]
  );

  // Handle working steps change - MUST be called unconditionally
  const handleWorkingStepsChange = useCallback(
    (steps: string[]) => {
      // Don't allow changes if question is already answered
      if (isQuestionAnswered) return;

      onWorkingStepsChange(steps);
    },
    [onWorkingStepsChange, isQuestionAnswered]
  );

  // Type safety checks - AFTER hooks are called
  if (!question?.question) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">
            Question not available
          </p>
        </CardContent>
      </Card>
    );
  }

  // ✅ PERFORMANCE: Using memoized values (calculated above)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Question {questionIndex + 1}</Badge>
            {question.question.marks && (
              <Badge variant="outline">
                {question.question.marks} mark
                {question.question.marks !== 1 ? 's' : ''}
              </Badge>
            )}
            {isMCQ && <Badge variant="outline">Multiple Choice</Badge>}
            {isQuestionAnswered && (
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              >
                ✓ Answered
              </Badge>
            )}
          </div>

          {/* <Button
            variant="ghost"
            size="sm"
            onClick={onFlagToggle}
            className={questionStatus === 'ANSWERED' ? 'text-orange-500' : ''}
          >
            <Flag className="mr-1 h-4 w-4" />
            {questionStatus === 'ANSWERED' ? 'Flagged' : 'Flag'}
          </Button> */}
        </div>
        <Progress value={progress} className="mt-2 w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed">
            {question.question.questionText || 'Question text not available'}
          </p>
        </div>

        {/* MCQ Options */}
        {isMCQ && (
          <div className="space-y-3">
            <RadioGroup
              value={mcqAnswer?.toString() ?? ''}
              onValueChange={handleMcqSelect}
              disabled={isQuestionAnswered}
            >
              {mcqOptions.map((option, index) => {
                console.log('Rendering option:', option, 'at index:', index);
                if (!option.id) {
                  return null;
                }
                return (
                  <div
                    key={option.id ?? `option-${index}`}
                    className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                      isQuestionAnswered
                        ? 'dark:bg-gray-750 border-gray-300 bg-gray-50 opacity-75 dark:border-gray-600'
                        : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id?.toString()}
                      id={`option-${index}`}
                      className="mt-1"
                      disabled={isQuestionAnswered}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className={`flex-1 ${isQuestionAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          ({option.componentOrder ?? index + 1})
                        </span>
                        <div className="text-gray-900 dark:text-white">
                          {option.isImageOption && option.imageUrl ? (
                            <Image
                              src={option.imageUrl}
                              alt={`Option ${option.componentOrder ?? index + 1}`}
                              width={200}
                              height={128}
                              className="max-h-32 object-contain"
                            />
                          ) : (
                            <span>
                              {option.contentText ??
                                'Option text not available'}
                            </span>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {/* Short Answer Area */}
        {!isMCQ && (
          <div className="space-y-4">
            {/* Working Steps */}
            <div
              className={`rounded-lg border p-4 ${
                isQuestionAnswered
                  ? 'dark:bg-gray-750 border-gray-300 bg-gray-50 dark:border-gray-600'
                  : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800'
              }`}
            >
              <WorkingSteps
                steps={workingSteps}
                onChange={handleWorkingStepsChange}
                disabled={isSubmittingAnswer || isQuestionAnswered}
              />
            </div>
            <div
              className={`rounded-lg border p-4 ${
                isQuestionAnswered
                  ? 'dark:bg-gray-750 border-gray-300 bg-gray-50 dark:border-gray-600'
                  : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800'
              }`}
            >
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Answer:
              </label>
              <Textarea
                className="min-h-32 resize-none"
                placeholder={
                  isQuestionAnswered
                    ? 'Already answered'
                    : 'Write your answer here...'
                }
                value={shortAnswer}
                onChange={handleTextareaChange}
                disabled={isQuestionAnswered}
                readOnly={isQuestionAnswered}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ✅ PERFORMANCE: Memoize component to prevent unnecessary re-renders
// Only re-render if props actually change
export { QuestionContent };
export default memo(QuestionContent);
