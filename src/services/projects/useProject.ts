import axiosInstance from '@/lib/axiosInstance';
import {
  CreateProjectRequest,
  CreateProjectReponse,
  GetJoinProjectRequest,
  GetJoinProjectResponse,
  PostJoinProjectRequest,
  PostJoinProjectResponse,
} from '@/types/api/project';

// 프로젝트 생성
export const postCreateProject = async (
  body: CreateProjectRequest
): Promise<CreateProjectReponse> => {
  const { data } = await axiosInstance.post<CreateProjectReponse>('/api/v1/projects', body);
  return data;
};

// 초대코드 유효성 확인 (GET)
export const getJoinProject = async (
  params: GetJoinProjectRequest
): Promise<GetJoinProjectResponse> => {
  const { data } = await axiosInstance.get<GetJoinProjectResponse>(
    `/api/v1/projects/join?inviteCode=${params.inviteCode}`
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
