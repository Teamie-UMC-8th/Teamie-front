'use client';

import { useState } from 'react';
import PersonalSection from '@/features/retrospects/components/PersonalSection';

export default function PersonalRetroPage() {
  return (
    <div className="w-full px-[128px] pt-[60px] max-lg:px-[32px]">
      <div className="w-full lg:max-w-[1415px] flex flex-col">
        {/* 제목 */}
        <h2
          className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
        max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0] mb-[16px] whitespace-nowrap"
        >
          개인 회고
        </h2>

        {/* 구분선 */}
        <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[80px]" />

        {/* 개인 회고 섹션 */}
        <PersonalSection />
      </div>
    </div>
  );
}
