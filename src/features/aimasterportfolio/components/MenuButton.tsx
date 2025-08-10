'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMasterPortfolioDetail } from '@/hooks/queries/useGetMasterPortfolio';

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const portfolioId = Number(params.portfolioId);

  // 포트폴리오 정보에서 프로젝트 ID 가져오기
  const { data: portfolioDetail } = useMasterPortfolioDetail(portfolioId);
  const projectId = portfolioDetail?.projectId;

  return (
    <div className="absolute top-0 right-[20px] relative ml-auto max-lg:w-[32px] max-lg:h-[32px]">
      {/* 메뉴 아이콘 버튼 */}
      <button onClick={() => setOpen(!open)} aria-label="메뉴 열기">
        <img src="/icons/menu-icon.svg" alt="메뉴" className="w-[36px] h-[36px] cursor-pointer" />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          className="absolute top-[40px] right-0 w-[256px] bg-white rounded-[8px] z-50 
          shadow-[0_0_15px_rgba(0,0,0,0.2)] py-[12px]"
        >
          <div className="flex flex-col" onClick={() => setOpen(false)}>
            <button
              onClick={() => router.push('/mypage')}
              className="px-[24px] py-[4px] text-[18px] text-left leading-[26px] font-normal text-black cursor-pointer"
            >
              프로젝트 홈으로 이동
            </button>

            <hr className="w-[90%] border-[1px] border-[#BBBBBB] my-[8px] mx-auto" />

            <button
              onClick={() => projectId && router.push(`/projects/${projectId}/retrospect/create`)}
              className="px-[24px] py-[4px] text-[18px] text-left leading-[26px] font-normal text-black cursor-pointer"
            >
              개인 회고로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
