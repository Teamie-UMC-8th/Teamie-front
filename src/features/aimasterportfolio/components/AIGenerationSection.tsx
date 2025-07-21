'use client';

import { useRouter } from 'next/navigation';

export default function AIGenerationSection() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full h-[804px] rounded-[16px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.20)] p-[40px] gap-[32px]">
      <div className="w-[160px] h-[160px] bg-[#D9D9D9]" />
      <p className="w-[275px] h-[56px] font-[Pretendard] text-[20px] leading-[28px] font-semibold text-[#000000] text-center">
        Teamie의 AI, 티미와 함께 마스터 포트폴리오를 생성해보세요!
      </p>
      <button
        onClick={() => router.push('/mypage/aimasterportfolio/create/ai')}
        className="flex items-center justify-center gap-[10px] px-[40px] cursor-pointer py-[10px] border border-[#81D7D4] rounded-[6px] font-[Pretendard] font-bold text-[18px] leading-[26px] text-white bg-[#81D7D4]"
      >
        시작하기
      </button>
    </div>
  );
}