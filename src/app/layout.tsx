'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import localFont from 'next/font/local';
import { AuthProvider } from '../contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/globals.css';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const queryClient = new QueryClient();

// 인증이 필요한 페이지들
const PROTECTED_ROUTES = ['/home', '/projects', '/mypage', '/new'];

// 인증이 필요 없는 페이지들
const PUBLIC_ROUTES = ['/login'];

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
      router.push('/login');
    } else if (isPublicRoute && isAuthenticated) {
      router.push('/home/tasks');
    }
  }, [pathname, isAuthenticated, router]);

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AuthWrapper>{children}</AuthWrapper>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
