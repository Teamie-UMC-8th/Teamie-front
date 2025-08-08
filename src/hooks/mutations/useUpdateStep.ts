import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStep } from '@/services/dashboard/dashboard';

// STEP 수정 mutation 훅
export const useUpdateStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, name }: { stepId: number; name: string }) =>
      updateStep(stepId, { name }),
    onSuccess: (data, variables) => {
      // STEP 수정 성공 시 대시보드 데이터 무효화하여 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        exact: false,
      });
    },
  });
};
