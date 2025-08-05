import { useQuery } from '@tanstack/react-query';
import { checkPlanDetail } from '@/services/plans/plans'; // ✅ services/plans.ts 기준

export const useGetPlanDetail = (planId: string) =>
  useQuery({
    queryKey: ['planDetail', planId],
    queryFn: () => checkPlanDetail(planId),
    enabled: !!planId, // planId 없으면 호출 안함
  });
