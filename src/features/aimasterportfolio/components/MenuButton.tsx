'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      className="
        relative lg:ml-auto shrink-0 min-w-[36px]
         max-lg:absolute max-lg:top-[118px] max-lg:right-[30px]"
    >
      {/* 버튼 */}
      <button onClick={() => setOpen(!open)} aria-label="메뉴 열기">
        <img src="/icons/menu-icon.svg" alt="메뉴" className="w-[36px] h-[36px]" />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          className="
            absolute top-[40px] right-0
            w-[256px] h-[100px] bg-white rounded-[8px] z-50
            shadow-[0_0_15px_rgba(0,0,0,0.2)]
          "
        >
          <div className="flex flex-col" onClick={() => setOpen(false)}>
            <button
              onClick={() => router.push('/mypage')}
              className="w-[150px] h-[26px] mt-[13px] ml-[24px] text-[18px] text-left leading-[26px] font-normal text-black"
            >
              프로젝트 홈으로 이동
            </button>

            <hr className="w-[90%] h-0 border-[1.5px] border-[#BBBBBB] mt-[8px] mx-auto" />

            <button
              onClick={() => router.push('/retrospect')}
              className="w-[118px] h-[26px] mt-[13px] ml-[24px] text-[18px] text-left leading-[26px] font-normal text-black"
            >
              개인회고로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}