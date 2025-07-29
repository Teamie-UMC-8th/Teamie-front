import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  checkTaskDetail,
  updateTaskDetail,
  deleteTaskDetail,
} from '@/services/taskDetail/checkTaskDetail';
import { UpdateTaskRequest, UpdateTaskResponse, DeleteTaskResponse } from '@/types/api/taskDetail';

// 조회용 쿼리는 일반적으로 useQuery로 처리하지만,
// 필요한 경우 useMutation으로 lazy load도 가능

export const useUpdateTaskDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // taskId와 수정 데이터를 받아 updateTaskDetail(taskId, data)를 호출
    mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskRequest }) =>
      updateTaskDetail(taskId, data),
    // 수정 성공 시 해당 taskId의 캐시를 무효화하여 최신 데이터를 가져오도록 함
    onSuccess: (_data: UpdateTaskResponse, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', variables.taskId] });
    },
  });
};

export const useDeleteTaskDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => deleteTaskDetail(taskId),
    // 삭제 성공 시 해당 taskId의 캐시를 제거하여 데이터가 사라지도록 함
    onSuccess: (_data: DeleteTaskResponse, taskId) => {
      queryClient.removeQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
