// src/utils/authRoute.ts

// 인증이 필요한 페이지 경로의 접두사입니다.
const PROTECTED_ROUTES = ['/home', '/projects', '/myPage', '/new'];

// 인증이 필요 없는 공개 페이지 경로입니다.
const PUBLIC_PATHS = ['/login', '/callback'];

interface AuthRouteStatus {
  isProtectedRoute: boolean;
  isPublicPath: boolean;
}

// 주어진 경로(pathname)가 보호된 경로인지, 공개 경로인지 확인하는 유틸리티 함수입니다.
export const checkAuthRoute = (pathname: string): AuthRouteStatus => {
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  return { isProtectedRoute, isPublicPath };
};
