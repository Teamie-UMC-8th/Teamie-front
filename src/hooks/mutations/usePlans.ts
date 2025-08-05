import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  deletePlan,
  updatePlan,
  updatePlanUsers,
} from "@/services/plans/plans";
import { PatchPlanRequest } from "@/types/api/plans";
import PatchPlanUsersRequest from "@/types/api/plans";

export const usePatchPlan = () =>
  useMutation({
    mutationFn: ({
      planId,
      planData,
    }: {
      planId: string;
      planData: PatchPlanRequest;
    }) => updatePlan(planId, planData),
  });

export const usePatchPlanUsers = () =>
  useMutation({
    mutationFn: ({
      planId,
      userData,
    }: {
      planId: string;
      userData: PatchPlanUsersRequest;
    }) => updatePlanUsers(planId, userData),
  });

export const useDeletePlan = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      alert("일정이 성공적으로 삭제되었습니다.");
      router.push("/projects/[projectId]/teamcalendar"); // 실제 경로로 교체
    },
  });
};
