import { useQuery } from "@tanstack/react-query";
import { getCalendarPlans } from "@/services/teamcalendar/check";


export const useGetCalendarPlans = (projectId: string) => {
  return useQuery({
    queryKey: ["calendarPlans", projectId],
    queryFn: () => getCalendarPlans(projectId),
    enabled: !!projectId,
  });
};
