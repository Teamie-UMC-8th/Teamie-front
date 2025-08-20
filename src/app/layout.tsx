'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import localFont from 'next/font/local';
import { AuthProvider } from '../contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/globals.css';
import { WebSocketProvider } from '@/contexts/WebSocketContext';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const queryClient = new QueryClient();

// 인증이 필요한 페이지들
const PROTECTED_ROUTES = ['/home', '/projects', '/myPage', '/new'];

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isLoginPage = pathname === '/login';

    // 현재 전체 경로(쿼리 포함)
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const currentFullPath = `${pathname}${search}`;

    // 1. 인증된 사용자가 로그인 페이지에 접근한 경우
    if (isLoginPage && isAuthenticated) {
      const params = new URLSearchParams(search);
      const next = params.get('next');
      router.replace(next || '/home/tasks');
      return;
    }

    // 2. 인증되지 않은 사용자가 보호된 경로에 접근한 경우
    if (isProtectedRoute && !isAuthenticated) {
      // 의도 경로를 next로 넘기며 로그인 페이지로 이동
      const nextParam = encodeURIComponent(currentFullPath);
      router.replace(`/login?next=${nextParam}`);
      return;
    }
  }, [pathname, isAuthenticated, router, isLoading]);

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <WebSocketProvider>
              <AuthWrapper>{children}</AuthWrapper>
            </WebSocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
