'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // AuthProvider를 통해 이미 인증된 상태로 확인되면,
    // 사용자가 실수로 로그인 페이지에 접근했더라도 홈으로 보내줍니다.
    if (isAuthenticated) {
      router.push('/home/tasks');
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    // 백엔드의 카카오 소셜 로그인 시작점으로 리디렉션합니다.
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // 환경에 따라 다른 URL 사용
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    if (isLocalhost) {
      // 로컬 환경에서는 redirect_url 파라미터 추가
      window.location.href = `${backendUrl}/auth/kakao?redirect_url=http://localhost:3000/`;
    } else {
      // 배포 환경에서는 기본 URL 사용
      window.location.href = `${backendUrl}/auth/kakao`;
    }
  };

  // 아직 인증되지 않은 사용자에게만 이 페이지가 보여집니다.
  // (인증된 사용자는 위 useEffect에 의해 리디렉션됩니다.)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-white via-white to-[#B6F5DF]/50">
      <div className="flex flex-col items-start lg:gap-[1.813rem] gap-[1.5rem]">
        <p className="lg:text-[1.875rem] text-[1.5rem] font-bold text-black">
          나의 팀워크가 모이는 곳,
        </p>
        <div className="lg:mb-[7.5rem] mb-[5rem]">
          <img
            src="/logo.svg"
            alt="Teamie Logo"
            className="lg:w-[34.063rem] w-[25.563rem] lg:h-[5rem] h-[3.75rem]"
          />
        </div>
      </div>
      <button
        className="self-center lg:px-[9.25rem] px-[8.75rem] lg:py-[0.75rem] py-[0.5rem] flex items-center gap-[0.5rem] bg-[#FEE500] text-black rounded-[0.5rem] lg:text-[1.25rem] text-[1.125rem] font-semibold cursor-pointer"
        onClick={handleLogin}
      >
        <img src="/icons/kakao.svg" alt="Kakao Logo" className="w-[1.375rem] h-[1.313rem]" />
        카카오 로그인
      </button>
    </div>
  );
}
