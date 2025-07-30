import { UserProfile, UserResponse } from '@/types/api/user';
import axiosInstance from '@/lib/axiosInstance';

// 사용자 프로필 정보를 가져오는 함수
export default async function fetchUserProfile(): Promise<UserProfile> {
  const { data } = await axiosInstance.get<UserResponse>('/api/v1/users/me');
  return data.result;
}
