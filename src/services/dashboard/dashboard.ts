import axiosInstance from '@/lib/axiosInstance';
import { GetDashboardRequest, DashboardResponse } from '@/types/api/dashboard';
import {
  CreateStepRequest,
  CreateStepResponse,
  UpdateStepRequest,
  UpdateStepResponse,
  DeleteStepResponse,
} from '@/types/api/steps';
import { CreateTaskResponse } from '@/types/api/tasks';
import { ApiResponse } from '@/types/api/error';

// 프로젝트 대시보드 조회
export const getDashboard = async (params: GetDashboardRequest): Promise<DashboardResponse> => {
  const { projectId, view } = params;
  const response = await axiosInstance.get<ApiResponse<DashboardResponse>>(
    `/api/v1/tasks/${projectId}/dashboard?view=${view}`
  );

  // API 응답이 { isSuccess, error, result } 형태로 감싸져 있으므로 result에서 실제 데이터 추출
  if (response.data.isSuccess && response.data.result) {
    return response.data.result;
  } else {
    throw new Error('대시보드 데이터를 불러오는데 실패했습니다.');
  }
};

// STEP 생성
export const createStep = async (request: CreateStepRequest): Promise<CreateStepResponse> => {
  const { projectId, name } = request;
  const { data } = await axiosInstance.post<CreateStepResponse>(
    `/api/v1/projects/${projectId}/steps`,
    { name }
  );
  return data;
};

// STEP 삭제
export const deleteStep = async (stepId: number): Promise<DeleteStepResponse> => {
  const { data } = await axiosInstance.delete<DeleteStepResponse>(`/api/v1/steps/${stepId}`);
  return data;
};

// STEP 수정
export const updateStep = async (request: UpdateStepRequest): Promise<UpdateStepResponse> => {
  const { stepId, name } = request;
  const { data } = await axiosInstance.patch<UpdateStepResponse>(`/api/v1/steps/${stepId}`, {
    name,
  });
  return data;
};

// 업무 생성
export const createTask = async (stepId: number): Promise<CreateTaskResponse> => {
  const { data } = await axiosInstance.post<CreateTaskResponse>(`/api/v1/tasks`, { stepId });
  return data;
};
