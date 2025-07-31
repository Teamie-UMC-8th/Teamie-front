import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  checkTaskDetail,
  updateTaskDetail,
  deleteTaskDetail,
} from '@/services/taskDetail/checkTaskDetail';
import {
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
  TaskDetailResponse,
} from '@/types/api/taskDetail';

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
    // 삭제 성공 시 관련 캐시들을 정리
    onSuccess: (_data: DeleteTaskResponse, taskId) => {
      // 해당 업무 상세 캐시 제거
      queryClient.removeQueries({ queryKey: ['taskDetail', taskId] });

      // 프로젝트 대시보드 캐시 무효화 (업무 목록이 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: ['projectDashboard'] });

      // 사용자 목록 캐시 무효화 (담당자 정보가 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
    // 에러 처리
    onError: (error: Error) => {
      console.error('업무 삭제 mutation 에러:', error);
    },
  });
};

// 메모 변경 핸들러를 포함한 커스텀 훅
export const useTaskMemoHandler = () => {
  const [memo, setMemo] = useState('');
  const updateTaskMutation = useUpdateTaskDetail();

  const handleMemoChange = (
    newMemo: string,
    taskId: number,
    taskData: TaskDetailResponse | undefined
  ) => {
    setMemo(newMemo);
    if (!taskData?.result) return;

    updateTaskMutation.mutate({
      taskId,
      data: {
        ...taskData.result,
        memo: newMemo,
        managerIds: taskData.result.managers.map((m) => m.userId),
        existingFileUrls: taskData.result.files?.map((f) => f.fileUrl) ?? [],
      },
    });
  };

  return {
    memo,
    setMemo,
    handleMemoChange,
    isUpdating: updateTaskMutation.isPending,
  };
};

// 삭제 핸들러를 포함한 커스텀 훅
export const useTaskDeleteHandler = () => {
  const router = useRouter();
  const deleteTaskMutation = useDeleteTaskDetail();

  const handleDelete = async (taskId: number, projectId: number) => {
    try {
      const result = await deleteTaskMutation.mutateAsync(taskId);

      // 성공 메시지 표시 (선택사항)
      console.log('삭제 성공:', result.result.message);

      // 대시보드로 이동
      router.push(`/projects/${projectId}/dashboard`);
    } catch (err: any) {
      console.error('삭제 실패:', err);

      // 구체적인 에러 메시지 표시
      const errorMessage = err.message || '삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return {
    handleDelete,
    isDeleting: deleteTaskMutation.isPending,
  };
};
