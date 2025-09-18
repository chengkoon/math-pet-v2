'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: ErrorInfo | undefined;
}

/**
 * Error Boundary component following coding standards
 * Provides graceful error handling for QuestionViewer and other components
 */
export class QuestionViewerErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      'QuestionViewer Error Boundary caught an error:',
      error,
      errorInfo
    );

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send error to logging service
    // logErrorToService(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined as Error | undefined,
      errorInfo: undefined as ErrorInfo | undefined,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-600">
                  Something went wrong
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                The question viewer encountered an unexpected error. This has
                been logged and will be investigated.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                  <p className="mb-2 text-sm font-medium text-red-800 dark:text-red-200">
                    Development Error Details:
                  </p>
                  <pre className="overflow-auto text-xs text-red-700 dark:text-red-300">
                    {this.state.error.message}
                  </pre>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} className="flex-1">
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper for easier usage
 * Use this to wrap components that need error boundary protection
 */
export const withQuestionViewerErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = (props: P) => (
    <QuestionViewerErrorBoundary>
      <Component {...props} />
    </QuestionViewerErrorBoundary>
  );

  WrappedComponent.displayName = `withQuestionViewerErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

/**
 * Simple error fallback component for smaller errors
 */
export const QuestionViewerErrorFallback = ({
  resetError,
}: {
  resetError: () => void;
}) => (
  <Card className="m-6">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <CardTitle className="text-lg text-red-600">
          Error Loading Question
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400">
        Unable to load the question. Please try again.
      </p>
      <Button onClick={resetError} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);
