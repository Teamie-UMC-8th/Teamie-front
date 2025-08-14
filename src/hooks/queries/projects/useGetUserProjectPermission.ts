import { useQuery } from '@tanstack/react-query';
import { getUserProjectPermission } from '@/services/projects/useProject';

export const useGetUserProjectPermission = (projectId: string) => {
  return useQuery({
    queryKey: ['userProjectPermission', projectId],
    queryFn: () => getUserProjectPermission(projectId),
    enabled: !!projectId,
  });
};
