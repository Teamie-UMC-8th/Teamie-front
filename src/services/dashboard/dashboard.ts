import axiosInstance from '@/lib/axiosInstance';
import {
  GetDashboardRequest,
  DashboardResponse,
  CreateStepRequest,
  CreateStepResponse,
} from '@/types/api/dashboard';

// 프로젝트 대시보드 조회
export const getDashboard = async (params: GetDashboardRequest): Promise<DashboardResponse> => {
  const { projectId, view } = params;
  const response = await axiosInstance.get(`/api/v1/tasks/${projectId}/dashboard?view=${view}`);

  // API 응답이 { isSuccess, error, result } 형태로 감싸져 있으므로 result에서 실제 데이터 추출
  if (response.data.isSuccess && response.data.result) {
    return response.data.result;
  } else {
    throw new Error('대시보드 데이터를 불러오는데 실패했습니다.');
  }
};

// STEP 생성
export const createStep = async (
  projectId: number,
  body: CreateStepRequest
): Promise<CreateStepResponse> => {
  const { data } = await axiosInstance.post<CreateStepResponse>(
    `/api/v1/projects/${projectId}/steps`,
    body
  );
  return data;
};

// STEP 삭제
export const deleteStep = async (stepId: number): Promise<string> => {
  const { data } = await axiosInstance.delete(`/api/v1/steps/${stepId}`);
  return data;
};
