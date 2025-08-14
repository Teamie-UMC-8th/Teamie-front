import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskStep } from '@/services/steps/updateTaskStep';
import { UpdateTaskStepRequest } from '@/types/api/steps';

interface UpdateTaskStepParams {
  stepId: number;
  taskId: number;
  data: UpdateTaskStepRequest;
}

export const useUpdateTaskStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, taskId, data }: UpdateTaskStepParams) =>
      updateTaskStep(stepId, taskId, data),
    onSuccess: (data) => {
      // 대시보드 데이터 무효화
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      console.log('Task step 업데이트 성공:', data);
    },
    onError: (error) => {
      console.error('Task step 업데이트 실패:', error);
    },
  });
};
