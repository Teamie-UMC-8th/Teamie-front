import { useQuery } from '@tanstack/react-query';
import { getJoinProject } from '@/services/projects/useProject';
import { GetJoinProjectRequest, GetJoinProjectResponse } from '@/types/api/project';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api/error';

export const useGetProject = (params: GetJoinProjectRequest) => {
  return useQuery<GetJoinProjectResponse, AxiosError<ApiResponse<{ project: { id: string } }>>>({
    queryKey: ['getProject', params.inviteCode],
    queryFn: () => getJoinProject(params),
    enabled: !!params.inviteCode,
    retry: false, // 재시도 비활성화
  });
};
