import { postMasterPortfolioQuestions } from '@/services/masterportfolio/masterportfolio';
import { useMutation } from '@tanstack/react-query';

interface QuestionMutationVariables {
  portfolioId: number;
  recordIdList: number[];
}

export const usePostMasterPortfolioQuestions = () => {
  return useMutation({
    mutationFn: ({ portfolioId, recordIdList }: QuestionMutationVariables) =>
      postMasterPortfolioQuestions(portfolioId, { recordIdList }),
  });
};
