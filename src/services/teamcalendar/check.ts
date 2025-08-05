import axiosInstance from "@/lib/axiosInstance";
import { GetCalendarPlansResponse } from "@/types/api/teamcalendar";

export const getCalendarPlans = async ({
  projectId,
  startDate,
  endDate,
}: {
  projectId: string;
  startDate: string;
  endDate: string;
}): Promise<GetCalendarPlansResponse> => {
  const { data } = await axiosInstance.get(
    `/api/v1/projects/${projectId}/plans`,
    {
      params: {
        startDate,
        endDate,
      },
    }
  );
  return data;
};
