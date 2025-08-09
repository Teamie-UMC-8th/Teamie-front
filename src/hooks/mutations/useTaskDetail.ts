import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { updateTaskDetail, deleteTaskDetail } from '@/services/taskDetail/checkTaskDetail';
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
      console.log('✅ 업무 수정 성공:', {
        taskId: variables.taskId,
        status: variables.data.status,
      });
      queryClient.invalidateQueries({ queryKey: ['taskDetail', variables.taskId] });
    },
    // 에러 처리 추가
    onError: (error: Error, variables) => {
      console.error('❌ 업무 수정 실패:', {
        taskId: variables.taskId,
        status: variables.data.status,
        error: error.message,
      });

      // NOTSTART 상태로 변경할 때 특별한 에러 메시지
      if (variables.data.status === 'NOTSTART') {
        console.error('🔍 NOTSTART 상태 변경 실패 - 가능한 원인:');
        console.error('1. 담당자가 없는 상태에서 NOTSTART로 변경 시도');
        console.error('2. 마감일이 지난 상태에서 NOTSTART로 변경 시도');
        console.error('3. API에서 NOTSTART 상태 변경을 허용하지 않음');
        console.error('4. 기타 비즈니스 로직 제약사항');
      }
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

  const handleMemoChange = useCallback((newMemo: string) => {
    setMemo(newMemo);
  }, []);

  const handleMemoBlur = useCallback(
    (taskId: number, taskData: TaskDetailResponse | undefined) => {
      if (!taskData?.result) return;

      updateTaskMutation.mutate({
        taskId,
        data: {
          ...taskData.result,
          memo: memo,
          managerIds: taskData.result.managers.map((m) => m.userId),
          existingFileUrls: taskData.result.files?.map((f) => f.fileUrl) ?? [],
        },
      });
    },
    [memo, updateTaskMutation]
  );

  return {
    memo,
    setMemo,
    handleMemoChange,
    handleMemoBlur,
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
    } catch (err: unknown) {
      console.error('삭제 실패:', err);

      // 구체적인 에러 메시지 표시
      const errorMessage = err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return {
    handleDelete,
    isDeleting: deleteTaskMutation.isPending,
  };
};

// 업무 삭제 mutation 훅
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (taskId: number) => {
      console.log('🎯 useDeleteTask - mutationFn 호출:', { taskId });
      return deleteTaskDetail(taskId);
    },
    onSuccess: (data: DeleteTaskResponse, taskId) => {
      console.log('✅ 업무 삭제 mutation 성공:', { taskId, data });

      // 응답 데이터 검증
      if (!data || !data.isSuccess) {
        console.error('❌ 업무 삭제 실패: API 응답이 성공이 아님:', data);
        alert('업무 삭제에 실패했습니다.');
        return;
      }

      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
      queryClient.invalidateQueries({ queryKey: ['taskFiles', taskId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      // 이전 페이지로 이동
      router.back();
    },
    onError: (error: Error) => {
      console.error('❌ 업무 삭제 mutation 에러:', error);
      alert(error.message || '업무 삭제에 실패했습니다.');
    },
  });
};
