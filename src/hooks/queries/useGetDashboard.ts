import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/services/dashboard/dashboard';
import { GetDashboardRequest } from '@/types/api/dashboard';

// 대시보드 조회 쿼리 훅
export const useGetDashboard = (params: GetDashboardRequest) => {
  return useQuery({
    queryKey: ['dashboard', params.projectId, params.view],
    queryFn: () => getDashboard(params),
    enabled: !!params.projectId && !!params.view,
  });
};
