'use client';

import { UserProfile, UserProject } from '@/types/api/user';
import fetchUserProfile, {
  fetchUserProjects,
  updateUserProfile,
  updateMainTask,
} from '@/services/user/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { checkAuthRoute } from '@/utils/authRoute';

// 기본 사용자 정보만 가져오는 훅
export const useUser = () => {
  const pathname = usePathname();
  const { isPublicPath } = checkAuthRoute(pathname);

  return useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh 상태로 유지합니다.
    refetchOnWindowFocus: !isPublicPath, // 공개 경로에서는 브라우저 창이 포커스되어도 데이터를 다시 가져오지 않습니다.
    retry: (failureCount, error: any) => {
      // 401 에러는 인터셉터가 처리하므로 재시도하지 않습니다.
      if (error.response?.status === 401) {
        return false;
      }
      // 그 외 에러는 2번까지 재시도합니다.
      return failureCount < 2;
    },
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
