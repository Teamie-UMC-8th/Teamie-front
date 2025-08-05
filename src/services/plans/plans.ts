import axiosInstance from "@/lib/axiosInstance";
import { PlanDetailResponse } from "@/types/api/plans";
import { PatchPlanRequest } from "@/types/api/plans";
import PatchPlanUsersRequest from "@/types/api/plans";

export const checkPlanDetail = async (planId: string): Promise<PlanDetailResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/plans/${planId}`);
  return data;
};

export const deletePlan = async (planId: string): Promise<void> => {
  await axiosInstance.delete(`/api/v1/plans/${planId}`);
};

export const updatePlan = async (
  planId: string,
  planData: PatchPlanRequest
): Promise<PlanDetailResponse> => {
  const { data } = await axiosInstance.patch(`/api/v1/plans/${planId}`, planData);
  return data;
};

export const updatePlanUsers = async (
  planId: string,
  userData: PatchPlanUsersRequest
): Promise<any> => {
  const { data } = await axiosInstance.patch(`/api/v1/plans/${planId}/users`, userData);
  return data;
};