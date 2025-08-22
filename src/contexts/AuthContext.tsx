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
import useThrottle from '@/hooks/useThrottle';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  logout: () => Promise<void>;
  isLoading: boolean;
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
  const [isUpgraded, setIsUpgraded] = useState(false);
  const { data: userData, error: userError, isLoading: isUserLoading } = useUser();
  const { data: projects = [] } = useUserProjects(!!userData);
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();

  // 브라우저 탭 포커스 시 5초 간격으로 사용자 인증 상태를 다시 확인합니다.
  // 다른 탭에서 로그아웃했거나 토큰이 만료된 경우를 감지하기 위함입니다.
  const throttledRefetch = useThrottle(() => {
    console.log('Window focused, revalidating user...');
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, 5000);

  useEffect(() => {
    window.addEventListener('focus', throttledRefetch);

    return () => {
      window.removeEventListener('focus', throttledRefetch);
    };
  }, [throttledRefetch]);

  const isAuthenticated = useMemo(() => !!userData && !userError, [userData, userError]);

  const user = useMemo(() => {
    if (userData) {
      return {
        ...userData,
        projects: projects || [],
      };
    }
    return null;
  }, [userData, projects]);

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // API 요청 성공 여부와 관계없이 항상 로컬 상태를 초기화하고 리디렉션합니다.
      queryClient.clear();
      // isAuthenticate 상태는 queryClient.clear() 후 useUser가 다시 실행되며 자동으로 false가 됩니다.
      router.push('/login');
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      logout,
      isLoading: isUserLoading, // useUser의 로딩 상태를 그대로 사용합니다.
      isUpgraded,
      setIsUpgraded,
    }),
    [isAuthenticated, user, isUserLoading, isUpgraded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
