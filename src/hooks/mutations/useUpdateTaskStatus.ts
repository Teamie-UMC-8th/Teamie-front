import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskStatus } from '@/services/tasks/updateTaskStatus';

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: number;
      status: 'NOTSTART' | 'ONGOING' | 'COMPLETED';
    }) => updateTaskStatus(taskId, { status }),
    onSuccess: (_data, variables) => {
      console.log('업무 상태 업데이트 성공:', {
        taskId: variables.taskId,
        status: variables.status,
      });

      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['projectDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['taskDetail', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // 업무대시보드 캐시 무효화
    },
    onError: (error: Error, variables) => {
      console.error('업무 상태 업데이트 실패:', {
        taskId: variables.taskId,
        status: variables.status,
        error: error.message,
      });
    },
  });
};
