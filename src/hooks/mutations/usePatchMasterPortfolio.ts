import { patchMasterPortfolio } from '@/services/masterPortfolio/masterportfolio';
import { PatchMasterPortfolioRequest } from '@/types/api/masterportfolio';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePatchMasterPortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      portfolioId,
      body,
    }: {
      portfolioId: number;
      body: PatchMasterPortfolioRequest;
    }) => patchMasterPortfolio(portfolioId, body),
    onSuccess: (_data, variables) => {
      // 상세/목록 캐시 무효화로 즉시 반영
      queryClient.invalidateQueries({ queryKey: ['master-portfolios'] });
      if (variables?.portfolioId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['master-portfolio', variables.portfolioId] });
      }
    },
  });
};
