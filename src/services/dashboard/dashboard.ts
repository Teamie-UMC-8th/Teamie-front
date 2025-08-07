import axiosInstance from '@/lib/axiosInstance';
import { GetDashboardRequest, DashboardResponse } from '@/types/api/dashboard';

// 프로젝트 대시보드 조회
export const getDashboard = async (params: GetDashboardRequest): Promise<DashboardResponse> => {
  const { projectId, view } = params;
  const { data } = await axiosInstance.get<DashboardResponse>(
    `/api/v1/tasks/${projectId}/dashboard?view=${view}`
  );
  return data;
};
