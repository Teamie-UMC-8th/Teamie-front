'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-[4px] mr-[30px]">
      {/* 프로필 아이콘 */}
      <button onClick={() => setOpen(!open)}>
        <img src="/icons/profile.svg" alt="프로필" className="cursor-pointer " />
      </button>

      {/* 드롭다운 */}
      {open && (
        <div
          className="absolute bg-white w-[265px] h-[100px] rounded-[8px] right-[4px] "
          style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
        >
          <div className="flex flex-col" onClick={() => setOpen(false)}>
            <Link href="/mypage">
              <button className="flex mt-[13px] ml-[20px] cursor-pointer">
                <img src="/icons/myPage-dropdown.svg" alt="마이페이지" className="mr-[12px]" />
                <div className="text-[#505050] text-[18px]">마이페이지</div>
              </button>
            </Link>
            <Link href="/login">
              <hr className="border-[1px] border-[#BBBBBB] w-[249px] ml-[8px] mt-[6px]"></hr>
              <button className="flex ml-[24px] mt-[12px] cursor-pointer">
                <img src="/icons/logout.svg" alt="로그아웃" className="mr-[12px]" />
                <div className="text-[#505050] text-[18px]">로그아웃</div>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
