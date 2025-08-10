'use client';

import {
  useMasterPortfolioStatus,
  useMasterPortfolioDetail,
} from '@/hooks/queries/useGetMasterPortfolio';
import { useGetPersonalRetro } from '@/hooks/queries/useGetPersonalRetro';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

interface AIGenerationSectionProps {
  contribution: number;
}

export default function AIGenerationSection({ contribution }: AIGenerationSectionProps) {
  const router = useRouter();
  const params = useParams();
  const portfolioId = Number(params.portfolioId);

  const [showToast, setShowToast] = useState(false);
  const { data: status } = useMasterPortfolioStatus(portfolioId);

  const handleStartClick = () => {
    if (contribution > 0) {
      if (status?.result.status === 'NEED_ANSWERS') {
        router.push(`/mypage/aimasterportfolio/${portfolioId}/create/ai?step=2`);
      } else {
        router.push(`/mypage/aimasterportfolio/${portfolioId}/create/ai`);
      }
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000); // 2초 후 사라짐
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[1492px] max-lg:w-[928px] h-[804px] max-lg:h-[720px] rounded-[16px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.20)] p-[40px]">
      <div className="mb-[32px]">
        <img src="/icons/AITeamieIcon.svg" alt="티미 아이콘" />
      </div>
      <p className="w-[275px] h-[56px] font-[Pretendard] text-[20px] leading-[28px] font-semibold text-[#000000] text-center mb-[32px]">
        Teamie의 AI, 티미와 함께 마스터 포트폴리오를 생성해보세요!
      </p>
      <button
        onClick={handleStartClick}
        className="flex items-center justify-center gap-[10px] px-[40px] py-[10px] cursor-pointer border border-[#81D7D4] rounded-[6px] font-[Pretendard] font-bold text-[18px] leading-[26px] text-white bg-[#81D7D4] mb-[20px]"
      >
        시작하기
      </button>

      {showToast && (
        <div
          className="w-[205px] h-[42px] px-[20px] py-[8px] bg-[#F8F8F8] border-[1.5px] border-[#BBBBBB] rounded-[6px] 
          text-[18px] text-[#505050]] flex items-center justify-center whitespace-nowrap leading-[26px] text-center"
        >
          기여도를 입력해주세요.
        </div>
      )}
    </div>
  );
}
