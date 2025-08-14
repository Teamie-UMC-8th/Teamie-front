import axiosInstance from '@/lib/axiosInstance';
import {
  CreateProjectRequest,
  CreateProjectReponse,
  GetJoinProjectRequest,
  GetJoinProjectResponse,
  PostJoinProjectRequest,
  PostJoinProjectResponse,
  UserProjectPermissionResponse,
  CompleteProjectResponse,
} from '@/types/api/project';

// 프로젝트 생성
export const postCreateProject = async (
  body: CreateProjectRequest
): Promise<CreateProjectReponse> => {
  // 생성자의 권한을 LEAD로 설정
  const requestBody = {
    ...body,
    permission: 'LEAD',
  };

  const { data } = await axiosInstance.post<CreateProjectReponse>('/api/v1/projects', requestBody);
  return data;
};

// 초대코드 유효성 확인 (GET)
export const getJoinProject = async (
  params: GetJoinProjectRequest
): Promise<GetJoinProjectResponse> => {
  const { data } = await axiosInstance.get<GetJoinProjectResponse>(
    `/api/v1/projects/join/validate?inviteCode=${params.inviteCode}`
  );
  return data;
};

// 프로젝트 참여 (POST)
export const postJoinProject = async (
  body: PostJoinProjectRequest
): Promise<PostJoinProjectResponse> => {
  const { data } = await axiosInstance.post<PostJoinProjectResponse>('/api/v1/projects/join', body);
  return data;
};

// 사용자의 프로젝트 권한을 조회하는 함수
export const getUserProjectPermission = async (
  projectId: string
): Promise<UserProjectPermissionResponse> => {
  const response = await axiosInstance.get(`/api/v1/projects/${projectId}/my-permission`);
  return response.data;
};

// 프로젝트 완료 (PATCH)
export const patchCompleteProject = async (projectId: number): Promise<CompleteProjectResponse> => {
  const { data } = await axiosInstance.patch<CompleteProjectResponse>(
    `/api/v1/projects/${projectId}/complete`
  );
  return data;
};
