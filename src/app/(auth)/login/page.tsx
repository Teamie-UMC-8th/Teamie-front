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
      <div className="flex flex-col items-start lg:gap-[29px] gap-[24px]">
        <p className="lg:text-[30px] text-[24px] font-bold text-black">나의 팀워크가 모이는 곳,</p>

        <div className="lg:mb-[120px] mb-[80px]">
          <img
            src="/logo.svg"
            alt="Teamie Logo"
            className="lg:w-[545px] w-[409px] lg:h-[80px] h-[60px]"
          />
        </div>
      </div>

      <button
        className="self-center lg:px-[148px] px-[140px] lg:py-[12px] py-[8px] flex items-center gap-[8px] bg-[#FEE500] text-black rounded-[8px] lg:text-[20px] text-[18px] font-semibold cursor-pointer"
        onClick={handleLogin}
      >
        <img src="/icons/kakao.svg" alt="Kakao Logo" className="w-[22px] h-[21px]" />
        카카오 로그인
      </button>
    </div>
  );
}
