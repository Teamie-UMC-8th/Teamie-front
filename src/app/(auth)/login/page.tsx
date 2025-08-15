'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');

  const handleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    // callback(경로)은 백엔드가 redirect_url 기준으로 '/callback'을 붙이는 경우가 많으므로
    // 여기서는 origin만 전달하여 '/callback/callback' 중복을 방지합니다.
    const redirectUrl = encodeURIComponent(origin);

    // callback 이후 복귀 경로 유지
    const nextQuery = nextParam ? `&next=${encodeURIComponent(nextParam)}` : '';

    window.location.href = `${backendUrl}/auth/kakao?redirect_url=${redirectUrl}${nextQuery}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-white via-white to-[#B6F5DF]/50">
      <div className="flex flex-col items-start lg:gap-[1.813rem] gap-[1.5rem]">
        <p className="lg:text-[1.875rem] text-[1.5rem] font-bold text-black">
          나의 팀워크가 모이는 곳,
        </p>
        <div className="lg:mb-[7.5rem] mb-[5rem]">
          <Image
            src="/logo.svg"
            alt="Teamie Logo"
            width={544}
            height={80}
            className="lg:w-[34.063rem] w-[25.563rem] lg:h-[5rem] h-[3.75rem]"
          />
        </div>
      </div>
      <button
        className="self-center lg:px-[9.25rem] px-[8.75rem] lg:py-[0.75rem] py-[0.5rem] flex items-center gap-[0.5rem] bg-[#FEE500] text-black rounded-[0.5rem] lg:text-[1.25rem] text-[1.125rem] font-semibold cursor-pointer"
        onClick={handleLogin}
      >
        <Image src="/icons/kakao.svg" alt="Kakao Logo" width={22} height={21} />
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
