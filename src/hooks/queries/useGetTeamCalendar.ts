import { getCalendarPlans } from '@/services/teamCalendar/check';
import { useQuery } from '@tanstack/react-query';

export const useGetCalendarPlans = (projectId: string, startDate: string, endDate: string) =>
  useQuery({
    queryKey: ['calendarPlans', projectId, startDate, endDate],
    queryFn: () => getCalendarPlans({ projectId, startDate, endDate }),
    enabled: !!projectId && !!startDate && !!endDate,
  });
