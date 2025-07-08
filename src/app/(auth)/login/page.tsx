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
      <div className="flex flex-col items-start gap-[29px]">
        <p className="text-[30px] font-bold text-black">나의 팀워크가 모이는 곳,</p>

        <div className="mb-[120px]">
          <img src="/logo.svg" alt="Teamie Logo" width={545} height={80} />
        </div>
      </div>

      <button
        className="self-center px-[148px] py-[12px] flex items-center gap-[8px] bg-[#FEE500] text-black rounded-[8px] font-semibold cursor-pointer"
        onClick={handleLogin}
      >
        <img src="/icons/kakao.svg" alt="Kakao Logo" className="w-[22px] h-[21px]" />
        카카오 로그인
      </button>
    </div>
  );
}
