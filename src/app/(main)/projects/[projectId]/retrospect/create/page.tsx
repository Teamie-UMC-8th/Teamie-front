'use client';

import PersonalSection from '@/features/retrospects/components/PersonalSection';

export default function PersonalRetroPage() {
  return (
    <div>
      <div className="flex w-full flex flex-col">
        {/* 제목 */}
        <h2
          className="mt-[60px] mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
        max-lg:text-[20px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0] mb-[16px] whitespace-nowrap"
        >
          개인 회고
        </h2>

        {/* 구분선 */}
        <hr className="flex w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[80px]" />

        {/* 개인 회고 섹션 */}
        <PersonalSection />
      </div>
    </div>
  );
}
