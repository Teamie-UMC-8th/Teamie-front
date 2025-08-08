import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStep } from '@/services/dashboard/dashboard';
import { CreateStepRequest, CreateStepResponse } from '@/types/api/dashboard';

// STEP 생성 mutation 훅
export const useCreateStep = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateStepResponse, Error, CreateStepRequest>({
    mutationFn: (request: CreateStepRequest) => createStep(request),
    onSuccess: (data, variables) => {
      // STEP 생성 성공 시 대시보드 데이터 무효화하여 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ['dashboard', variables.projectId],
        exact: false,
      });
    },
  });
};
