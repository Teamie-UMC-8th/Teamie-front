import { useMutation } from '@tanstack/react-query';
import { uploadTaskFile } from '@/services/taskDetail/addFile';
import { UploadFileResponse } from '@/types/api/fileUploader';
import { deleteTaskFile } from '@/services/taskDetail/addFile';

export const useUploadTaskFile = () => {
  return useMutation<UploadFileResponse, Error, { taskId: number; file: File }>({
    mutationFn: ({ taskId, file }) => uploadTaskFile(taskId, file),
    onSuccess: (data) => {
      // 필요 시 캐시 무효화 등의 로직 추가 가능
      console.log('파일 업로드 성공:', data);
    },
    onError: (error) => {
      console.error('파일 업로드 실패:', error);
    },
  });
};

export const useDeleteTaskFile = () => {
  return useMutation<void, Error, number>({
    mutationFn: (taskFileId) => deleteTaskFile(taskFileId),
    onSuccess: () => {
      console.log('파일 삭제 성공');
    },
    onError: (error) => {
      console.error('파일 삭제 실패:', error);
    },
  });
};
