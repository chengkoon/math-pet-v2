import { PacksApi } from '@chengkoon/mathpet-api-types';
import type {
  PagedPackResponse,
  GetExamPacksRequest,
  PackStructureResponse,
  GetPackStructureRequest,
} from '@chengkoon/mathpet-api-types';
import { getApiConfig, handleApiError } from './config';

// Initialize PacksApi
const packsApi = new PacksApi(getApiConfig());

// Packs API service
export const packsService = {
  async getExamPacks(
    params: GetExamPacksRequest = {}
  ): Promise<PagedPackResponse> {
    try {
      return await packsApi.getExamPacks(params);
    } catch (error) {
      console.error('Get exam packs error:', error);
      return handleApiError(error);
    }
  },

  async getPackStructure(
    params: GetPackStructureRequest
  ): Promise<PackStructureResponse> {
    try {
      return await packsApi.getPackStructure(params);
    } catch (error) {
      console.error('Get pack structure error:', error);
      return handleApiError(error);
    }
  },
};
