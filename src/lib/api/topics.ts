import { TopicsApi } from '@chengkoon/mathpet-api-types';
import type {
  PagedTopics,
  GetTopicsRequest,
} from '@chengkoon/mathpet-api-types';
import { getApiConfig } from './config';

// Initialize API client instance
const topicsApi = new TopicsApi(getApiConfig());

// Export service with clean domain methods
export const topicsService = {
  async getTopics(
    params: {
      page?: number;
      size?: number;
      depthType?: string;
    } = {}
  ): Promise<PagedTopics> {
    try {
      const request: GetTopicsRequest = {
        page: params.page ?? 0,
        size: params.size ?? 20,
        depthType: params.depthType ?? 'Sub-strand',
      };

      const response = await topicsApi.getTopics(request);
      return response;
    } catch (error) {
      console.error('Get topics error:', error);
      throw error;
    }
  },
};
