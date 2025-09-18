import { useQuery } from '@tanstack/react-query';
import type { PackStructureResponse } from '@chengkoon/mathpet-api-types';
import { packsService } from '@/lib/api/packs';

export const usePackStructure = (packId: string, enabled = true) => {
  return useQuery<PackStructureResponse>({
    queryKey: ['pack-structure', packId],
    queryFn: () => packsService.getPackStructure({ id: packId }),
    enabled: enabled && !!packId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
