import { postMasterPortfolioGenerate } from '@/services/masterPortfolio/masterportfolio';
import { useMutation } from '@tanstack/react-query';

interface QuestionMutationVariables {
  portfolioId: number;
}

export const usePostMasterPortfolioGenerate = () => {
  return useMutation({
    mutationFn: ({ portfolioId }: QuestionMutationVariables) =>
      postMasterPortfolioGenerate(portfolioId),
  });
};
