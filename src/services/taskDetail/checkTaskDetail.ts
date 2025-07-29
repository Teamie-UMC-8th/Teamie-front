import axios from 'axios';
import {
  TaskDetailResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
} from '@/types/api/taskDetail';

// 업무 상세 조회 함수
export const checkTaskDetail = async (taskId: number): Promise<TaskDetailResponse> => {
  const response = await axios.get(`/api/v1/tasks/${taskId}`);
  return response.data;
};

// 업무 수정 함수
export const updateTaskDetail = async (
  taskId: number,
  data: UpdateTaskRequest
): Promise<UpdateTaskResponse> => {
  const response = await axios.patch(`/api/v1/tasks/${taskId}`, data);
  return response.data;
};

// 업무 삭제 함수
export const deleteTaskDetail = async (taskId: number): Promise<DeleteTaskResponse> => {
  const response = await axios.delete(`/api/v1/tasks/${taskId}`);
  return response.data;
};
