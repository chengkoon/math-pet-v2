import { PracticeApi } from '@chengkoon/mathpet-api-types';
import type {
  StartPracticeSessionRequest,
  PracticeSessionResponse,
  UpdateQuestionAttemptRequest,
  QuestionAttemptResponse,
  TopicPracticeSessionSummary,
  UpdatePracticeSessionRequest,
  PracticeQuestionResponse,
} from '@chengkoon/mathpet-api-types';
import { getApiConfig } from './config';

// Initialize Practice API client instance
const practiceApi = new PracticeApi(getApiConfig());

// Export practice service with clean domain methods
export const practiceService = {
  /**
   * Start a new practice session for a pack or topic
   */
  async startPracticeSession(
    request: StartPracticeSessionRequest
  ): Promise<PracticeSessionResponse> {
    try {
      const response = await practiceApi.startPracticeSession({
        startPracticeSessionRequest: request,
      });
      return response;
    } catch (error) {
      console.error('Start practice session error:', error);
      throw error;
    }
  },

  /**
   * Get practice session details
   */
  async getPracticeSession(
    sessionId: string
  ): Promise<PracticeSessionResponse> {
    try {
      const response = await practiceApi.getPracticeSession({
        sessionId,
      });
      return response;
    } catch (error) {
      console.error('Get practice session error:', error);
      throw error;
    }
  },

  /**
   * Get specific question in practice session
   */
  async getPracticeSessionQuestion(
    sessionId: string,
    questionIndex: number
  ): Promise<PracticeQuestionResponse> {
    try {
      const response = await practiceApi.getPracticeSessionQuestion({
        sessionId,
        questionIndex,
      });
      return response;
    } catch (error) {
      console.error('Get practice session question error:', error);
      throw error;
    }
  },

  /**
   * Get user's practice sessions
   */
  async getUserPracticeSessions(
    status?: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED',
    packId?: string
  ): Promise<PracticeSessionResponse[]> {
    try {
      const params: {
        status?: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
        packId?: string;
      } = {};
      if (status) params.status = status;
      if (packId) params.packId = packId;

      const response = await practiceApi.getUserPracticeSessions(params);
      return response;
    } catch (error) {
      console.error('Get user practice sessions error:', error);
      throw error;
    }
  },

  /**
   * Update practice session progress
   */
  async updatePracticeSession(
    sessionId: string,
    request: UpdatePracticeSessionRequest
  ): Promise<PracticeSessionResponse> {
    try {
      const response = await practiceApi.updatePracticeSession({
        sessionId,
        updatePracticeSessionRequest: request,
      });
      return response;
    } catch (error) {
      console.error('Update practice session error:', error);
      throw error;
    }
  },

  /**
   * Update question attempt
   */
  async updateQuestionAttempt(
    sessionId: string,
    request: UpdateQuestionAttemptRequest
  ): Promise<QuestionAttemptResponse> {
    try {
      const response = await practiceApi.updateQuestionAttempt({
        sessionId,
        updateQuestionAttemptRequest: request,
      });
      return response;
    } catch (error) {
      console.error('Update question attempt error:', error);
      throw error;
    }
  },

  /**
   * End topic practice session and get summary
   */
  async endTopicPracticeSession(
    sessionId: string
  ): Promise<TopicPracticeSessionSummary> {
    try {
      const response = await practiceApi.endTopicPracticeSession({
        sessionId,
      });
      return response;
    } catch (error) {
      console.error('End topic practice session error:', error);
      throw error;
    }
  },
};
