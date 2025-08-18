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
import { useRouter } from 'next/navigation';

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
  // pro 업그레이드 상태 추가
  const [isUpgraded, setIsUpgraded] = useState(false);
  const { data: userData, error: userError, isLoading } = useUser();
  const { data: projects = [] } = useUserProjects(!!userData);
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();

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

  useEffect(() => {
    if (!isLoading) {
      if (userData && !userError) {
        setIsAuthenticated(true);
      } else if (userError) {
        setIsAuthenticated(false);
      }
    }
  }, [userData, userError, isLoading]);

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
      isLoading,
      isUpgraded,
      setIsUpgraded,
    }),
    [isAuthenticated, user, isLoading, isUpgraded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
