import { UserProfile, UserProject } from '@/types/api/user';
import fetchUserProfile, {
  fetchUserProjects,
  updateUserProfile,
  updateMainTask,
} from '@/services/user/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// 사용자 프로필 수정 훅
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      // 성공 시 사용자 정보 캐시 업데이트
      queryClient.setQueryData(['user'], updatedProfile);
    },
    onError: (error) => {
      console.error('프로필 업데이트 실패:', error);
    },
  });
};

// 주요 업무 수정 훅
export const useUpdateMainTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ portfolioId, mainTask }: { portfolioId: number; mainTask: string }) =>
      updateMainTask(portfolioId, { mainTask }),
    onSuccess: () => {
      // 성공 시 프로젝트 목록 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['master-portfolios'] });
    },
    onError: (error) => {
      console.error('주요 업무 업데이트 실패:', error);
    },
  });
};
