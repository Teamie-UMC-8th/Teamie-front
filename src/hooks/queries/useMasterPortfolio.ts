import { useQuery } from '@tanstack/react-query';
import { getMasterPortfolioDetail } from '@/services/masterportfolio/masterportfolio';

export const useMasterPortfolioDetail = (projectId: number) => {
  return useQuery({
    queryKey: ['masterPortfolioDetail', projectId],
    queryFn: () => getMasterPortfolioDetail(projectId),
    enabled: !!projectId,
  });
};
