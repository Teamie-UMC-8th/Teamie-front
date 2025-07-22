'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // 임시 로그인 처리
    router.push('/home/calendar');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-white via-white to-[#B6F5DF]">
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
