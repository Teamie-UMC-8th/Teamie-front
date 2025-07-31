import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadTaskFile, deleteTaskFile } from '@/services/taskDetail/uploadFile';
import { UploadFileResponse, DeleteFileResponse } from '@/types/api/fileUpload';

// 파일 업로드 mutation
export const useUploadTaskFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: number; file: File }) => uploadTaskFile(taskId, file),
    onSuccess: (_data: UploadFileResponse, variables) => {
      // 파일 업로드 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskFiles', variables.taskId] });
    },
    onError: (error: Error) => {
      console.error('파일 업로드 mutation 에러:', error);
    },
  });
};

// 파일 삭제 mutation
export const useDeleteTaskFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskFileId: number) => deleteTaskFile(taskFileId),
    onSuccess: (_data: DeleteFileResponse, taskFileId) => {
      // 파일 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskFiles'] });
    },
    onError: (error: Error) => {
      console.error('파일 삭제 mutation 에러:', error);
    },
  });
};
