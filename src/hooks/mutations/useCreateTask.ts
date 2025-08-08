import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/services/dashboard/dashboard';
import { CreateTaskResponse } from '@/types/api/dashboard';

// 업무 생성 mutation 훅
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateTaskResponse, Error, number>({
    mutationFn: (stepId: number) => createTask(stepId),
    onSuccess: (data, stepId) => {
      // 업무 생성 성공 시 대시보드 데이터 무효화하여 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        exact: false,
      });
    },
  });
};
