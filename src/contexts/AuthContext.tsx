'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
} from 'react';
import { useUser, useUserProjects } from '@/hooks/mutations/useUser';
import { useLogout } from '@/hooks/mutations/useLogout';
import { UserProfile } from '@/types/api/user';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  logout: () => Promise<void>;
  isLoading: boolean;
  // pro 업그레이드 토글 상태 추가
  isUpgraded: boolean;
  setIsUpgraded: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatusChecked, setAuthStatusChecked] = useState(false); // 1. 인증 확인 완료 상태 추가
  // pro 업그레이드 상태 추가
  const [isUpgraded, setIsUpgraded] = useState(false);
  const {
    data: userData,
    error: userError,
    isLoading: isUserLoading, // 2. useUser의 로딩 상태는 내부적으로만 사용
  } = useUser();
  const { data: projects = [] } = useUserProjects(!!userData);
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 추적

  // 사용자 정보와 프로젝트 정보를 합친 완전한 user 객체 (UI용)
  const user = useMemo(() => {
    if (userData) {
      return {
        ...userData,
        projects: projects || [],
      };
    }
    return null;
  }, [userData, projects]);

  // 페이지 이동 시마다 인증 상태를 다시 확인
  useEffect(() => {
    setAuthStatusChecked(false); // 로딩 상태로 전환하여 UI 깜빡임 방지
    queryClient.invalidateQueries({ queryKey: ['user'] }); // 사용자 정보 재조회 트리거
  }, [pathname, queryClient]);

  useEffect(() => {
    // 3. API 요청 로딩이 끝나면 인증 상태를 확정하고, 그 다음에 "인증 확인 절차 끝"으로 표시
    if (!isUserLoading) {
      if (userData && !userError) {
        setIsAuthenticated(true);
      } else if (userError) {
        setIsAuthenticated(false);
      }
      setAuthStatusChecked(true); // 인증 상태 세팅이 끝난 후, 확인 완료로 변경
    }
  }, [userData, userError, isUserLoading]);

  const logout = async () => {
    try {
      // 1. 백엔드에 로그아웃 요청 보내기 (필수)
      await logoutMutation.mutateAsync();

      // 2. 전역 상태(Global State) 초기화 (매우 중요)
      setIsAuthenticated(false);

      // 3. API 클라이언트 캐시 초기화
      queryClient.clear();

      // 4. 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (error) {
      console.error('Logout request failed:', error);

      // 에러가 발생해도 로컬 상태는 초기화하고 로그인 페이지로 이동
      setIsAuthenticated(false);
      queryClient.clear();
      router.push('/login');
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      logout,
      isLoading: !authStatusChecked, // 4. 외부에는 "인증 확인이 끝나지 않음"을 로딩 상태로 전달
      isUpgraded,
      setIsUpgraded,
    }),
    [isAuthenticated, user, authStatusChecked, isUpgraded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
