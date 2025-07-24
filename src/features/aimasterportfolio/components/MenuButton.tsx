'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative ml-auto">
      {/* 버튼 */}
      <button onClick={() => setOpen(!open)} className="ㅡ">
        <img src="/icons/menu-icon.svg" alt="메뉴" className="w-[36px] h-[36px]" />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          className="absolute bg-white w-[256px] h-[100px] rounded-[8px] right-[0.25rem]"
          style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
        >
          <div className="flex flex-col" onClick={() => setOpen(false)}>
            <button
              onClick={() => router.push('/mypage')}
              className="w-[150px] h-[26px] mt-[13px] ml-[24px] text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] text-left"
            >
              프로젝트 홈으로 이동
            </button>

            <hr className="w-[249px] h-0 border-[2px] border-[#BBBBBB] mt-[8px] mx-auto" />

            <button
              onClick={() => router.push('/retrospect')}
              className="w-[118px] h-[26px] mt-[13px] ml-[24px] text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] text-left"
            >
              개인회고로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
