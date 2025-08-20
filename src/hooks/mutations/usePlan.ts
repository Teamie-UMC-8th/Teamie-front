import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getPlanDetail, deletePlan, updatePlan, updatePlanUsers } from '@/services/plans/plan';
import { PatchPlanRequest, PatchPlanUsersRequest } from '@/types/api/plans';
import { ApiErrorResponse } from '@/types/api/error';
import { AxiosError } from 'axios';

// Query Hook
export const useGetPlanDetail = (planId: string) =>
  useQuery({
    queryKey: ['planDetail', planId],
    queryFn: () => getPlanDetail(planId),
    enabled: !!planId,
    staleTime: 60 * 1000,
  });

// Mutation Hooks
export const usePatchPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, planData }: { planId: string; planData: PatchPlanRequest }) =>
      updatePlan(planId, planData),
    onSuccess: (data, variables) => {
      if (data.isSuccess) {
        console.log('✅ 일정 수정 성공:', data.result);
        // 캐시 무효화로 즉시 반영
        queryClient.invalidateQueries({ queryKey: ['calendarPlans'] });
        queryClient.invalidateQueries({ queryKey: ['planDetail', variables.planId] });
      } else {
        console.error('❌ 일정 수정 실패:', data.error);
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('❌ 일정 수정 중 에러 발생:', error);
      if (error?.response?.data?.errorCode === 'PLAN4031') {
        console.error('권한이 없습니다. 프로젝트 멤버만 수정할 수 있습니다.');
      } else {
        console.error('일정 수정에 실패했습니다.');
      }
    },
  });
};

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
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('❌ 일정 사용자 수정 중 에러 발생:', error);
      if (error?.response?.data?.errorCode === 'PLAN4031') {
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
        // 삭제 성공 후 팀 캘린더 페이지로 리다이렉션
        // 현재 URL에서 projectId를 추출하여 사용
        const currentPath = window.location.pathname;
        const projectIdMatch = currentPath.match(/\/projects\/([^\/]+)/);
        if (projectIdMatch) {
          const projectId = projectIdMatch[1];
          router.push(`/projects/${projectId}/teamcalendar`);
        } else {
          // fallback: 홈으로 이동
          router.push('/home');
        }
      } else {
        console.error('❌ 일정 삭제 실패:', data.error);
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('❌ 일정 삭제 중 에러 발생:', error);
    },
  });
};
