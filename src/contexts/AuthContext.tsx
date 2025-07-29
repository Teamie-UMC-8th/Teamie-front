'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
} from 'react';
import axiosInstance from '../lib/axiosInstance';
import { User } from '@/types/api/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // 컨텍스트를 통해 user 정보에 접근할 수 있도록 추가
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
  const [user, setUser] = useState<User | null>(null); // 사용자 정보를 저장할 상태

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosInstance.get<{ result: User }>('/api/v1/users/me');

        // API 호출이 성공하면, 인증된 것으로 간주하고 사용자 정보를 저장합니다.
        if (response.data && response.data.result) {
          setIsAuthenticated(true);
          setUser(response.data.result);
        } else {
          // 비정상적인 응답 처리
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // 401 Unauthorized 등 에러 발생 시, 비인증 상태로 처리합니다.
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout'); // 백엔드에 로그아웃 API가 있다면 호출
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null); // 로그아웃 시 사용자 정보도 비웁니다.
      window.location.href = '/login';
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      logout,
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
