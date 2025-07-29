import { UploadFileResponse } from '@/types/api/fileUploader';
import axios from 'axios';

export const uploadTaskFile = async (taskId: number, file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`/api/v1/tasks/${taskId}/task-files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteTaskFile = async (taskFileId: number): Promise<void> => {
  await axios.delete(`/api/v1/task-files/${taskFileId}`);
};
