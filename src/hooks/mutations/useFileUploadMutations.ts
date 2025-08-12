import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { uploadTaskFile, deleteTaskFile } from '@/services/taskDetail/uploadFile';
import { UploadFileResponse, DeleteFileResponse } from '@/types/api/fileUpload';

// 파일 업로드 mutation
export const useUploadTaskFile = (): UseMutationResult<
  UploadFileResponse,
  Error,
  { taskId: number; file: File }
> => {
  const queryClient = useQueryClient();

  return useMutation<UploadFileResponse, Error, { taskId: number; file: File }>({
    mutationFn: ({ taskId, file }: { taskId: number; file: File }) => {
      console.log('🔄 파일 업로드 mutation 함수 호출:', {
        taskId,
        fileName: file.name,
        fileSize: file.size,
      });
      return uploadTaskFile(taskId, file);
    },
    onSuccess: (_data: UploadFileResponse, variables: { taskId: number; file: File }) => {
      const fileName = variables.file?.name || 'Unknown File';
      console.log('✅ 파일 업로드 mutation 성공:', {
        taskId: variables.taskId,
        fileName,
      });
      // 파일 업로드 후 taskDetail과 대시보드 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskDetail', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'], exact: false });
    },
    onError: (error: Error) => {
      console.error('❌ 파일 업로드 mutation 에러:', error);
      console.error('❌ 파일 업로드 mutation 에러 상세:', {
        errorMessage: error.message,
        errorStack: error.stack,
      });
    },
  });
};

// 파일 삭제 mutation
export const useDeleteTaskFile = (): UseMutationResult<DeleteFileResponse, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<DeleteFileResponse, Error, number>({
    mutationFn: (taskFileId: number) => deleteTaskFile(taskFileId),
    onSuccess: (data: DeleteFileResponse, taskFileId: number) => {
      console.log('✅ 파일 삭제 mutation 성공:', { taskFileId, message: data.message });
      // 파일 삭제 성공 시 taskDetail과 대시보드 캐시 무효화하여 서버 데이터 동기화
      queryClient.invalidateQueries({ queryKey: ['taskDetail'] as const });
      queryClient.invalidateQueries({ queryKey: ['dashboard'], exact: false });
    },
    onError: (error: Error) => {
      console.error('❌ 파일 삭제 mutation 에러:', error);
    },
  });
};
