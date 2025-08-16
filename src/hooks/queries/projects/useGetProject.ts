import { useQuery } from '@tanstack/react-query';
import { getJoinProject, getProjectIsCompleted } from '@/services/projects/useProject';
import {
  GetJoinProjectRequest,
  GetJoinProjectResponse,
  GetProjectIsCompletedResponse,
} from '@/types/api/project';
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

// 프로젝트 종료 여부 조회 훅
export const useGetProjectIsCompleted = (projectId?: number) => {
  return useQuery<GetProjectIsCompletedResponse>({
    queryKey: ['projectIsCompleted', projectId],
    queryFn: () => getProjectIsCompleted(projectId as number),
    enabled: typeof projectId === 'number' && projectId > 0,
    staleTime: 60 * 1000,
  });
};
