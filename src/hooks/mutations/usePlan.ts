import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getPlanDetail, deletePlan, updatePlan, updatePlanUsers } from '@/services/plans/plan';
import { PatchPlanRequest, PatchPlanUsersRequest } from '@/types/api/plans';

// Query Hook
export const useGetPlanDetail = (planId: string) =>
  useQuery({
    queryKey: ['planDetail', planId],
    queryFn: () => getPlanDetail(planId),
    enabled: !!planId,
  });

// Mutation Hooks
export const usePatchPlan = () =>
  useMutation({
    mutationFn: ({ planId, planData }: { planId: string; planData: PatchPlanRequest }) =>
      updatePlan(planId, planData),
    onSuccess: (data) => {
      if (data.isSuccess) {
        console.log('✅ 일정 수정 성공:', data.result);
      } else {
        console.error('❌ 일정 수정 실패:', data.error);
      }
    },
    onError: (error: any) => {
      console.error('❌ 일정 수정 중 에러 발생:', error);
      if (error?.response?.status === 403) {
        console.error('권한이 없습니다. 프로젝트 멤버만 수정할 수 있습니다.');
      } else {
        console.error('일정 수정에 실패했습니다.');
      }
    },
  });

export const usePatchPlanUsers = () =>
  useMutation({
    mutationFn: ({ planId, userData }: { planId: string; userData: PatchPlanUsersRequest }) =>
      updatePlanUsers(planId, userData),
    onSuccess: (data) => {
      if (data.isSuccess) {
        console.log('✅ 일정 사용자 수정 성공:', data.result);
      } else {
        console.error('❌ 일정 사용자 수정 실패:', data.error);
      }
    },
    onError: (error: any) => {
      console.error('❌ 일정 사용자 수정 중 에러 발생:', error);
      if (error?.response?.status === 403) {
        console.error('권한이 없습니다. 프로젝트 멤버만 수정할 수 있습니다.');
      } else {
        console.error('일정 사용자 수정에 실패했습니다.');
      }
    },
  });

export const useDeletePlan = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: (data) => {
      if (data.isSuccess) {
        console.log('✅ 일정 삭제 성공:', data.result?.message);
        router.push('/projects/[projectId]/teamcalendar'); // 실제 경로로 교체
      } else {
        console.error('❌ 일정 삭제 실패:', data.error);
      }
    },
    onError: (error: any) => {
      console.error('❌ 일정 삭제 중 에러 발생:', error);
    },
  });
};
