import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';

// 사용자 프로필 정보를 가져오는 훅
interface UserProfile {
  imageUrl: string;
  name: string;
  school: string | null;
  major: string | null;
  email: string;
  projectNum: number;
}

// API 응답 구조 타입 정의
// result 필드에 UserProfile 타입이 포함된 응답 구조
interface UserResponse {
  isSuccess: boolean;
  error: null;
  result: UserProfile;
}

// 사용자 프로필 정보를 가져오는 함수
const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<UserResponse>('/api/v1/users/me');
  return data.result;
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};
