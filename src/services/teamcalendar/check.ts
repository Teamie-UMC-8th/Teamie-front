import axiosInstance from "@/lib/axiosInstance";
import { CalendarPlanResponse } from "@/types/api/teamcalendar";

export const getCalendarPlans = async (projectId: string): Promise<CalendarPlanResponse["result"]> => {
  const response = await axiosInstance.get<CalendarPlanResponse>(
    `/api/v1/projects/${projectId}/plans`
  );
  return response.data.result;
};
