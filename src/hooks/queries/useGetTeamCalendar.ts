import { useQuery } from "@tanstack/react-query";
import { getCalendarPlans } from "@/services/teamcalendar/check";

export const useGetCalendarPlans = (
  projectId: string,
  startDate: string,
  endDate: string
) =>
  useQuery({
    queryKey: ["calendarPlans", projectId, startDate, endDate],
    queryFn: () => getCalendarPlans({ projectId, startDate, endDate }),
    enabled: !!projectId && !!startDate && !!endDate,
  });
