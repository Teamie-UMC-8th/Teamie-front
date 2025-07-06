'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full border-b-[2px] border-[#E7E7E7] bg-white h-[58px] z-10 relative">
      <div className="max-w-[1920px] mx-auto flex items-center h-full">
        <img src="/logo.svg" alt="Teamie 로고" className="h-[23px] mt-[1px] ml-[21px]" />

        <div className="flex items-center ml-[61px] gap-[60px]">
          <Link
            href="/home/calendar"
            className="flex items-center group text-black hover:text-[#81D7D4] cursor-pointer"
          >
            <button className="font-normal text-[18px] leading-[132%] tracking-[-0.02em] cursor-pointer">
              홈
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="ml-[2px] w-[24px] h-[24px]"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </Link>

          <Link
            href="/new/create"
            className="flex items-center group text-black hover:text-[#81D7D4] cursor-pointer"
          >
            <button className="font-normal text-[18px] leading-[132%] tracking-[-0.02em] cursor-pointer">
              프로젝트 추가
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="ml-[2px] w-[24px] h-[24px]"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </Link>

          <Link
            href="/projects/home"
            className="flex items-center group text-black hover:text-[#81D7D4] cursor-pointer"
          >
            <button className="font-normal text-[18px] leading-[132%] tracking-[-0.02em] cursor-pointer">
              나의 프로젝트
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="ml-[2px] w-[24px] h-[24px]"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </Link>
        </div>

        <div className="flex items-center ml-auto mr-[30px]">
          <button className="w-[143px] h-[32px] bg-[#81D7D4] text-white rounded-[4px] text-sm font-bold text-[16px] mr-[36px]">
            pro로 업그레이드
          </button>
          <div className="w-[32px] h-[32px] rounded-full overflow-hidden">
            <Link href="/mypage">
              <img src="/icons/profile.svg" alt="프로필" className="w-full h-full" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
