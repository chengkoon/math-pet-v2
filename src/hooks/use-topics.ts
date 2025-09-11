import { useQuery } from '@tanstack/react-query';
import { topicsService } from '@/lib/api/topics';
import type { PagedTopics } from '@chengkoon/mathpet-api-types';

interface UseTopicsParams {
  page?: number;
  size?: number;
  depthType?: string;
  enabled?: boolean;
}

export const useTopics = (params: UseTopicsParams = {}) => {
  const {
    page = 0,
    size = 20,
    depthType = 'Sub-strand',
    enabled = true,
  } = params;

  return useQuery({
    queryKey: ['topics', { page, size, depthType }],
    queryFn: () => topicsService.getTopics({ page, size, depthType }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - topics don't change frequently
  });
};
