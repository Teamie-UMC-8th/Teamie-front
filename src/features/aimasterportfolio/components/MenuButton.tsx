'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="absolute top-0 right-[20px] relative ml-auto max-lg:w-[32px] max-lg:h-[32px]">
      {/* 메뉴 아이콘 버튼 */}
      <button onClick={() => setOpen(!open)} aria-label="메뉴 열기">
        <img src="/icons/menu-icon.svg" alt="메뉴" className="w-[36px] h-[36px]" />
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
              className="px-[24px] py-[4px] text-[18px] text-left leading-[26px] font-normal text-black"
            >
              프로젝트 홈으로 이동
            </button>

            <hr className="w-[90%] border-[1px] border-[#BBBBBB] my-[8px] mx-auto" />

            <button
              onClick={() => router.push('/retrospect')}
              className="px-[24px] py-[4px] text-[18px] text-left leading-[26px] font-normal text-black"
            >
              개인 회고로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
