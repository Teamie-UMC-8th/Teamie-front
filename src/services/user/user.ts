import {
  UserProfile,
  UserResponse,
  UserProjectsResponse,
  UserProject,
  UpdateUserProfileParams,
} from '@/types/api/user';
import axiosInstance from '@/lib/axiosInstance';

// 사용자 프로필 정보를 가져오는 함수
export default async function fetchUserProfile(): Promise<UserProfile> {
  const { data } = await axiosInstance.get<UserResponse>('/api/v1/users/me');
  return data.result;
}

// 사용자가 속한 프로젝트 정보를 가져오는 함수
export async function fetchUserProjects(): Promise<UserProject[]> {
  const { data } = await axiosInstance.get<UserProjectsResponse>('/api/v1/users/me/projects');
  return data.result || [];
}

// 사용자 프로필 정보를 수정하는 함수
export async function updateUserProfile(params: UpdateUserProfileParams): Promise<UserProfile> {
  const formData = new FormData();

  if (params.school !== undefined) {
    formData.append('school', params.school);
  }

  if (params.major !== undefined) {
    formData.append('major', params.major);
  }

  if (params.file) {
    formData.append('file', params.file);
  }

  const { data } = await axiosInstance.patch<UserResponse>('/api/v1/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.result;
}
