import { useMutation } from "@tanstack/react-query";
import { postPlan } from "@/services/teamcalendar/create";

export const usePostPlan = () =>
  useMutation({
    mutationFn: postPlan, // { projectId, date }
  });
