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
import { UserProfile } from '@/types/api/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  logout: () => void;
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
  const { data: userData, error: userError } = useUser();
  const { data: projects = [] } = useUserProjects(!!userData);

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
    // 인증 검사는 userData 기준으로 (프로젝트 정보와 무관)
    if (userData && !userError) {
      setIsAuthenticated(true);
    } else if (userError) {
      setIsAuthenticated(false);
    }
  }, [userData, userError]);

  const logout = async () => {
    try {
      // 로그아웃 API 호출 (필요한 경우)
      // await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  // user가 없으면 렌더링하지 않음 (AuthWrapper에서 처리됨)
  if (!user) {
    return null;
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      user, // user가 null이 아님을 조건부 렌더링으로 보장
      logout,
    }),
    [isAuthenticated, user, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
