import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadTaskFile } from '@/services/taskDetail/addFile';
import { UploadFileResponse } from '@/types/api/fileUploader';

export const useUploadTaskFile = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadFileResponse, Error, { taskId: number; file: File }>({
    mutationFn: ({ taskId, file }) => uploadTaskFile(taskId, file),
    onSuccess: (data, variables) => {
      // 필요 시 캐시 무효화 등의 로직 추가 가능
      console.log('파일 업로드 성공:', data);
    },
    onError: (error) => {
      console.error('파일 업로드 실패:', error);
    },
  });
};
