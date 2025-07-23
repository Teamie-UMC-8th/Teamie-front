'use client';

import { useState } from 'react';

export default function New() {
  const [inviteVisible, setInviteVisible] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between pb-[1rem] px-[0.5rem] border-b-[0.125rem] border-[#E7E7E7]">
        <h1 className="text-[1.375rem] lg:text-[1.5rem] font-semibold lg:font-bold">
          프로젝트 생성
        </h1>
      </header>

      <main className="flex items-center justify-center mt-[128px]">
        <div className="flex flex-col items-start justify-center gap-[16px]">
          <div className="text-[22px] font-semibold px-[4px]">프로젝트 명</div>
          <div className="flex justify-center gap-[16px]">
            {/*프로젝트 이름 입력*/}
            <input
              placeholder="프로젝트 이름을 입력해주세요."
              className="w-[440px] h-[50px] border-[2px] border-[#BBBBBB] rounded-[8px] px-[16px] py-[12px] text-[18px]"
            />
            <button
              className="cursor-pointer self-center px-[12px] py-[4px] whitespace-nowrap bg-[#81D7D4] rounded-[4px] text-white font-bold text-[18px]"
              onClick={() => setInviteVisible((prev) => !prev)}
            >
              + 생성하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
