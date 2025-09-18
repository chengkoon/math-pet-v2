'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * QuestionViewerSkeleton - High-performance loading skeleton
 *
 * ✅ PERFORMANCE: Optimized for perceived performance
 * ✅ Uses CSS animations instead of JavaScript for 60 FPS
 * ✅ Matches actual component layout to prevent layout shifts
 * ✅ Minimal DOM nodes for fast rendering
 */
export const QuestionViewerSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Header Skeleton */}
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-6 w-48 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="h-5 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Question Content Skeleton */}
        <div className="space-y-6 lg:col-span-3">
          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                <div className="h-8 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="mt-2 h-2 w-full animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* MCQ Options Skeleton */}
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="h-4 w-4 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                    <div className="flex-1">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-10 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
            <div className="flex space-x-2">
              <div className="h-10 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
              <div className="h-10 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="h-10 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="h-6 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
            </CardHeader>
            <CardContent>
              {/* Session Info */}
              <div className="mb-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                </div>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* Question Grid Skeleton */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 animate-pulse rounded bg-gray-300 dark:bg-gray-600"
                  />
                ))}
              </div>

              {/* Complete Button */}
              <div className="mt-6 h-10 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
));

QuestionViewerSkeleton.displayName = 'QuestionViewerSkeleton';

/**
 * QuestionContentSkeleton - Skeleton for individual question content
 */
export const QuestionContentSkeleton = memo(() => (
  <Card>
    <CardHeader>
      <div className="flex animate-pulse items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-20 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="h-8 w-16 rounded bg-gray-300 dark:bg-gray-600" />
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-300 dark:bg-gray-600" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-600" />
        <div className="h-4 w-4/5 rounded bg-gray-300 dark:bg-gray-600" />
        <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    </CardContent>
  </Card>
));

QuestionContentSkeleton.displayName = 'QuestionContentSkeleton';

/**
 * MobilePaletteSkeleton - Skeleton for mobile question palette
 */
export const MobilePaletteSkeleton = memo(() => (
  <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-2xl lg:hidden dark:bg-gray-800">
    <div className="flex justify-center p-2">
      <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
    </div>

    <div className="animate-pulse px-4 pb-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="mb-2 h-6 w-32 rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>

      <div className="grid grid-cols-4 gap-3 py-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="h-12 w-full rounded bg-gray-300 dark:bg-gray-600"
          />
        ))}
      </div>

      <div className="mt-4 h-10 w-full rounded bg-gray-300 dark:bg-gray-600" />
    </div>
  </div>
));

MobilePaletteSkeleton.displayName = 'MobilePaletteSkeleton';
