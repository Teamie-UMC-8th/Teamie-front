import { useQuery } from '@tanstack/react-query';
import { getJoinProject } from '@/services/projects/useProject';
import { GetJoinProjectRequest } from '@/types/api/project';

export const useGetProject = (params: GetJoinProjectRequest) => {
  return useQuery({
    queryKey: ['getProject', params.inviteCode],
    queryFn: () => getJoinProject(params),
    enabled: !!params.inviteCode,
  });
};
