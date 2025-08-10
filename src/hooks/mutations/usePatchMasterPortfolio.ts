import { patchMasterPortfolio } from '@/services/masterportfolio/masterportfolio';
import { PatchMasterPortfolioRequest } from '@/types/api/masterportfolio';
import { useMutation } from '@tanstack/react-query';

export const usePatchMasterPortfolio = () => {
  return useMutation({
    mutationFn: ({
      portfolioId,
      body,
    }: {
      portfolioId: number;
      body: PatchMasterPortfolioRequest;
    }) => patchMasterPortfolio(portfolioId, body),
  });
};
