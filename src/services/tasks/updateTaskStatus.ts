import axiosInstance from '@/lib/axiosInstance';
import { UpdateTaskStatusRequest, UpdateTaskStatusResponse } from '@/types/api/tasks';

export const updateTaskStatus = async (
  taskId: number,
  data: UpdateTaskStatusRequest
): Promise<UpdateTaskStatusResponse> => {
  try {
    const response = await axiosInstance.patch<UpdateTaskStatusResponse>(
      `/api/v1/tasks/${taskId}/status`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('업무 상태 업데이트 실패:', error);
    throw error;
  }
};
