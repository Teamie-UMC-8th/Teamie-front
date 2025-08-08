import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStep } from '@/services/dashboard/dashboard';
import { DeleteStepResponse } from '@/types/api/dashboard';

// STEP 삭제 mutation 훅
export const useDeleteStep = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteStepResponse, Error, number>({
    mutationFn: (stepId: number) => deleteStep(stepId),
    onSuccess: (data, stepId) => {
      // STEP 삭제 성공 시 대시보드 데이터 무효화하여 다시 불러오기
      // 모든 프로젝트의 대시보드 쿼리를 무효화 (어떤 프로젝트의 스텝인지 알 수 없으므로)
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        exact: false,
      });
    },
  });
};
