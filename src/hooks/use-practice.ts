import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practiceService } from '@/lib/api/practice';
import type {
  StartPracticeSessionRequest,
  CheckQuestionAnswerRequest,
  UpdatePracticeSessionRequest,
} from '@chengkoon/mathpet-api-types';
import { toast } from 'sonner';

/**
 * Hook to start a new practice session
 */
export const useStartPracticeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StartPracticeSessionRequest) =>
      practiceService.startPracticeSession(request),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['practice-sessions'] });
      toast.success('Practice session started successfully!');
    },
    onError: (error) => {
      console.error('Failed to start practice session:', error);
      toast.error('Failed to start practice session. Please try again.');
    },
  });
};

/**
 * Hook to get practice session details
 */
export const usePracticeSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['practice-session', sessionId],
    queryFn: () => practiceService.getPracticeSession(sessionId),
    enabled: !!sessionId,
  });
};

/**
 * Hook to get practice session question
 */
export const usePracticeSessionQuestion = (
  sessionId: string,
  questionIndex: number
) => {
  return useQuery({
    queryKey: ['practice-session-question', sessionId, questionIndex],
    queryFn: () =>
      practiceService.getPracticeSessionQuestion(sessionId, questionIndex),
    enabled: !!sessionId && questionIndex >= 0,
  });
};

/**
 * Hook to get user's practice sessions
 */
export const usePracticeSessions = (
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED',
  packId?: string
) => {
  return useQuery({
    queryKey: ['practice-sessions', status, packId],
    queryFn: () => practiceService.getUserPracticeSessions(status, packId),
  });
};

/**
 * Hook to update practice session
 */
export const useUpdatePracticeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: string;
      request: UpdatePracticeSessionRequest;
    }) => practiceService.updatePracticeSession(sessionId, request),
    onSuccess: (data, variables) => {
      // Update the specific session in cache
      queryClient.invalidateQueries({
        queryKey: ['practice-session', variables.sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ['practice-sessions'] });
    },
    onError: (error) => {
      console.error('Failed to update practice session:', error);
      toast.error('Failed to update practice session. Please try again.');
    },
  });
};

/**
 * Hook to update question attempt
 */
export const useCheckQuestionAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: string;
      request: CheckQuestionAnswerRequest;
    }) => practiceService.checkQuestionAnswer(sessionId, request),
    onSuccess: (data, variables) => {
      // Show success/failure toast based on answer correctness
      if (data.isCorrect) {
        toast.success('Correct! Well done! 🎉');
      } else {
        toast.error('Incorrect. Keep trying! 💪');
      }

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['practice-session', variables.sessionId],
      });
    },
    onError: (error) => {
      console.error('Failed to check question answer:', error);
      toast.error('Failed to check answer. Please try again.');
    },
  });
};

/**
 * Hook to end topic practice session
 */
export const useEndTopicPracticeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      practiceService.endTopicPracticeSession(sessionId),
    onSuccess: (data, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: ['practice-session', sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ['practice-sessions'] });
      toast.success('Practice session completed!');
    },
    onError: (error) => {
      console.error('Failed to end practice session:', error);
      toast.error('Failed to end practice session. Please try again.');
    },
  });
};
