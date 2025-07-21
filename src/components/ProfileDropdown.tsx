'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-[0.25rem] mr-[1rem]">
      {/* 프로필 아이콘 */}
      <button onClick={() => setOpen(!open)}>
        <img src="/icons/profile.svg" alt="프로필" className="cursor-pointer " />
      </button>

      {/* 드롭다운 */}
      {open && (
        <div
          className="absolute bg-white w-[16.563rem] h-[6.25rem] rounded-[0.5rem] right-[0.25rem] "
          style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
        >
          <div className="flex flex-col" onClick={() => setOpen(false)}>
            <Link href="/mypage">
              <button className="flex mt-[0.813rem] ml-[1.25rem] cursor-pointer">
                <img src="/icons/myPage-dropdown.svg" alt="마이페이지" className="mr-[0.75rem]" />
                <div className="text-[#505050] text-[1.125rem]">마이페이지</div>
              </button>
            </Link>
            <Link href="/login">
              <hr className="border-[0.063rem] border-[#BBBBBB] w-[15.563rem] ml-[0.5rem] mt-[0.375rem]"></hr>
              <button className="flex ml-[1.5rem] mt-[0.75rem] cursor-pointer">
                <img src="/icons/logout.svg" alt="로그아웃" className="mr-[0.75rem]" />
                <div className="text-[#505050] text-[1.125rem]">로그아웃</div>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
