import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStep } from '@/services/dashboard/dashboard';
import { UpdateStepResponse, UpdateStepRequest } from '@/types/api/dashboard';

// STEP 수정 mutation 훅
export const useUpdateStep = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateStepResponse, Error, UpdateStepRequest>({
    mutationFn: (request: UpdateStepRequest) => updateStep(request),
    onSuccess: (data, variables) => {
      // STEP 수정 성공 시 대시보드 데이터 무효화하여 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        exact: false,
      });
    },
  });
};
