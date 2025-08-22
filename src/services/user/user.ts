import {
  UserProfile,
  UserResponse,
  UserProjectsResponse,
  UserProject,
  UpdateUserProfileParams,
  UpdateMainTaskParams,
  UpdateMainTaskResponse,
} from '@/types/api/user';
import axiosInstance from '@/lib/axiosInstance';

// 사용자 프로필 정보를 가져오는 함수
export default async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const { data } = await axiosInstance.get<UserResponse>('/api/v1/users/me');
    if (!data.result) {
      throw new Error('사용자 정보를 가져올 수 없습니다.');
    }
    return data.result;
  } catch (error) {
    console.error('fetchUserProfile 에러:', error);
    throw error; // 에러를 다시 throw하여 react-query가 인지하도록 함
  }
}

// 주요 업무를 수정하는 함수
export async function updateMainTask(
  portfolioId: number,
  params: UpdateMainTaskParams
): Promise<UpdateMainTaskResponse['result']> {
  const { data } = await axiosInstance.patch<UpdateMainTaskResponse>(
    `/api/v1/users/me/${portfolioId}`,
    params
  );

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

  if (params.school !== undefined && params.school !== null && params.school !== '') {
    formData.append('school', params.school);
  }

  if (params.major !== undefined && params.major !== null && params.major !== '') {
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

  if (!data.result) {
    throw new Error('사용자 정보를 업데이트할 수 없습니다.');
  }

  return data.result;
}
