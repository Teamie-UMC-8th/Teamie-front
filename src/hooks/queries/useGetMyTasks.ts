import { useQuery } from '@tanstack/react-query';
import { fetchMyTasks } from '@/services/tasks/myTask';
import { MyTaskResponse } from '@/types/api/tasks';

export function useGetMyTasks(cursor?: string) {
  return useQuery<MyTaskResponse>({
    queryKey: ['myTasks', cursor ?? null],
    queryFn: () => fetchMyTasks(cursor),
    staleTime: 1000 * 60,
  });
}
