import { useQuery } from '@tanstack/react-query';
import { getJoinProject } from '@/services/projects/useProject';
import { GetJoinProjectRequest, GetJoinProjectResponse } from '@/types/api/project';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api/error';

export const useGetProject = (params: GetJoinProjectRequest) => {
  return useQuery<GetJoinProjectResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ['getProject', params.inviteCode],
    queryFn: () => getJoinProject(params),
    enabled: !!params.inviteCode,
  });
};
