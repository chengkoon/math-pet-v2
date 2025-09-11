import { useQuery } from '@tanstack/react-query';
import { packsService } from '@/lib/api/packs';
import type { GetExamPacksRequest } from '@chengkoon/mathpet-api-types';

interface UseExamPacksParams extends GetExamPacksRequest {
  enabled?: boolean;
}

export const useExamPacks = (params: UseExamPacksParams = {}) => {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['exam-packs', queryParams],
    queryFn: () => packsService.getExamPacks(queryParams),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - exam packs don't change frequently
  });
};
