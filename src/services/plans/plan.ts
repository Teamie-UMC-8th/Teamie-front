import axiosInstance from '@/lib/axiosInstance';
import {
  PlanDetailResponse,
  PatchPlanRequest,
  DeletePlanResponse,
  PatchPlanUsersRequest,
} from '@/types/api/plans';

// 일정 조회
export const getPlanDetail = async (planId: string): Promise<PlanDetailResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/plans/${planId}`);
  return data;
};

// 일정 삭제
export const deletePlan = async (planId: string): Promise<DeletePlanResponse> => {
  const { data } = await axiosInstance.delete(`/api/v1/plans/${planId}`);
  return data;
};

// 일정 수정
export const updatePlan = async (
  planId: string,
  planData: PatchPlanRequest
): Promise<PlanDetailResponse> => {
  const { data } = await axiosInstance.patch(`/api/v1/plans/${planId}`, planData);
  return data;
};

// 일정 사용자 수정
export const updatePlanUsers = async (
  planId: string,
  userData: PatchPlanUsersRequest
): Promise<any> => {
  const { data } = await axiosInstance.patch(`/api/v1/plans/${planId}/users`, userData);
  return data;
};
