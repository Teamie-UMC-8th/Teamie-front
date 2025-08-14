import axiosInstance from '@/lib/axiosInstance';
import { UpdateTaskStepRequest, UpdateTaskStepResponse } from '@/types/api/steps';

export const updateTaskStep = async (
  stepId: number,
  taskId: number,
  data: UpdateTaskStepRequest
): Promise<UpdateTaskStepResponse> => {
  const response = await axiosInstance.patch<UpdateTaskStepResponse>(
    `/api/v1/steps/${stepId}/${taskId}`,
    data
  );
  return response.data;
};
