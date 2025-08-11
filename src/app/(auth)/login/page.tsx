'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');

  const handleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    // callback으로 돌아올 때 next를 유지하도록 쿼리에 포함
    const nextQuery = nextParam ? `&next=${encodeURIComponent(nextParam)}` : '';

    if (isLocalhost) {
      window.location.href = `${backendUrl}/auth/kakao?redirect_url=http://localhost:3000/callback${nextQuery}`;
    } else {
      window.location.href = `${backendUrl}/auth/kakao?redirect_url=${encodeURIComponent(window.location.origin + '/callback')}${nextQuery}`;
    }
  };

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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
