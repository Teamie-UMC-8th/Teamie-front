import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';

interface UpdateContributionParams {
  portfolioId: number;
  contributionRate: number;
}

export const useUpdateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ portfolioId, contributionRate }: UpdateContributionParams) => {
      const { data } = await axiosInstance.patch(`/api/v1/master-portfolios/${portfolioId}`, {
        contributionRate,
      });
      return data.result;
    },
    onSuccess: () => {
      // 마스터 포트폴리오 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['master-portfolios'] });
    },
    onError: (error) => {
      console.error('기여도 업데이트 실패:', error);
    },
  });
};
