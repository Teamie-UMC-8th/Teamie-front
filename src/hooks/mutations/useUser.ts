import { UserProfile, UserProject } from '@/types/api/user';
import fetchUserProfile, { fetchUserProjects } from '@/services/user/user';
import { useQuery } from '@tanstack/react-query';

// 기본 사용자 정보만 가져오는 훅
export const useUser = () => {
  return useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};

// 사용자가 속한 프로젝트 정보만 가져오는 훅
export const useUserProjects = (enabled: boolean = true) => {
  return useQuery<UserProject[]>({
    queryKey: ['user', 'projects'],
    queryFn: fetchUserProjects,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
