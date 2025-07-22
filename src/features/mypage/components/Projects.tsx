'use client';

import Link from 'next/link';

export default function Tailored() {
  return (
    <div className="flex">
      <Link href="/mypage/aimasterportfolio">
        <button
          className="bg-[#F8F8F8] w-[465px] h-[192px] rounded-[8px] grid justify-center mr-[24px] cursor-pointer
          max-lg:w-[421px] max-lg:h-[180px]"
          style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
        >
          <div
            className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px]
          max-lg:w-[397px] max-lg:h-[40px] max-lg:ml-[22px]"
          >
            <p
              className="absolute text-[18px] left-[12px]
            max-lg:text-[16px]"
            >
              프로젝트 명
            </p>
            <div
              className="absolute right-[8px] bg-[#CDE3C9] w-[80px] h-[32px] rounded-[4px] flex items-center justify-center
            max-lg:right-[4px]"
            >
              <span className="text-[16px]">동아리</span>
            </div>
          </div>

          <div className=" w-[439px] h-[96px]">
            <div className="flex mb-[12px]">
              <div className="text-[16px] text-[#898989] mr-[38px] ml-[12px] max-lg:ml-[36px]">
                기여도
              </div>
              <div className="text-[16px] text-black mr-[24px]">63%</div>
              <img src="/icons/percent-bar.svg" alt="Percent Bar" className="max-lg:w-[247px]" />
            </div>
            <div className="flex mb-[12px]">
              <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px] max-lg:ml-[36px]">
                진행 기간
              </div>
              <div className="text-[16px] text-black ">25.05~25.06</div>
            </div>
            <div className="flex">
              <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px] max-lg:ml-[36px]">
                주요 업무
              </div>
              <div className="text-[16px] text-black ">자료조사</div>
            </div>
          </div>
        </button>
      </Link>

      <Link href="/mypage/aimasterportfolio">
        <button
          className="bg-[#F8F8F8] w-[465px] h-[192px] rounded-[8px] grid justify-center cursor-pointer
          max-lg:w-[421px] max-lg:h-[180px]"
          style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
        >
          <div
            className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px]
          max-lg:w-[397px] max-lg:h-[40px] max-lg:ml-[22px]"
          >
            <p
              className="absolute text-[18px] left-[12px]
            max-lg:text-[16px]"
            >
              프로젝트 명
            </p>
            <div
              className="absolute right-[8px] bg-[#FBD5D5] w-[80px] h-[32px] rounded-[4px] flex items-center justify-center
            max-lg:right-[4px]"
            >
              <span>프로젝트</span>
            </div>
          </div>

          <div className=" w-[439px] h-[96px]">
            <div className="flex mb-[12px]">
              <div className="text-[16px] text-[#898989] mr-[38px] ml-[12px] max-lg:ml-[36px]">
                기여도
              </div>
              <div className="text-[16px] text-black mr-[24px]">63%</div>
              <img src="/icons/percent-bar.svg" alt="Percent Bar" className="max-lg:w-[247px]" />
            </div>
            <div className="flex mb-[12px]">
              <div
                className="text-[16px] text-[#898989] mr-[20px] ml-[12px] 
                max-lg:ml-[36px]"
              >
                진행 기간
              </div>
              <div className="text-[16px] text-black ">25.06~25.07</div>
            </div>
            <div className="flex">
              <div
                className="text-[16px] text-[#898989] mr-[20px] ml-[12px] 
              max-lg:ml-[36px]"
              >
                주요 업무
              </div>
              <div className="text-[16px] text-black ">자료조사</div>
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
}
