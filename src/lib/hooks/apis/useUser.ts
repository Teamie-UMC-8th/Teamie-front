// 마이페이지 프로필 조회 API 훅

import axiosInstance from '@/lib/apis/axiosInstance';
import { useQuery } from '@tanstack/react-query';

// 사용자 프로필 정보 타입 정의
interface UserProfile {
  imageUrl: string;
  name: string;
  school: string | null;
  major: string | null;
  email: string;
  projectNum: number;
}

// API 응답 타입 정의
// result 필드에 UserProfile 타입이 포함된 응답 형식
interface UserResponse {
  isSuccess: boolean;
  error: null;
  result: UserProfile;
}

// 사용자 프로필 조회 API 훅
const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<UserResponse>('/api/v1/users/me');
  return data.result;
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 캐시 유지 시간 5분
  });
};
