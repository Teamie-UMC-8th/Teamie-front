'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CalendarButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative ml-auto max-lg:w-[32px] max-lg:h-[32px]">
      {/* 메뉴 아이콘 버튼 */}
      <button onClick={() => setOpen(!open)} aria-label="메뉴 열기">
        <img src="/icons/menu-icon.svg" alt="햄버거" className=" cursor-pointer" />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          className="absolute top-[48px] right-0 w-[265px] h-[50px] bg-white rounded-[8px] z-50 
          shadow-[0_0_15px_rgba(0,0,0,0.2)] py-[12px]"
        >
          <div className=" whitespace-nowrap flex flex-col" onClick={() => setOpen(false)}>
            <button
              onClick={() => router.push('/project/[projectId]/teamcalendar/teamtask')} // 이거 경로 수정하면 돼요!
              className="pl-[20px] pr-[12px] py-[4px] text-[18px] text-left leading-[26px] font-normal text-black cursor-pointer"
            >
              회의 일정 수립
               <span className="ml-[70px] px-[10px] py-[2px] bg-[#B6F5DF] text-[#505050] text-[13px] rounded-full">
                 진행 중
                </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}