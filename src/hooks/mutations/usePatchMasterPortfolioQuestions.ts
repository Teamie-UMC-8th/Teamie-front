import { useMutation } from '@tanstack/react-query';
import { patchMasterPortfolioQuestions } from '@/services/masterPortfolio/masterportfolio';
import { PatchMasterPortfolioQuestionsRequest } from '@/types/api/masterportfolio';

interface PatchQuestionsVariables {
  portfolioId: number;
  body: PatchMasterPortfolioQuestionsRequest;
}

export const usePatchMasterPortfolioQuestions = () => {
  return useMutation({
    mutationFn: ({ portfolioId, body }: PatchQuestionsVariables) =>
      patchMasterPortfolioQuestions(portfolioId, body),
  });
};
