'use client';

import Link from 'next/dist/client/link';

export default function Tailored() {
  return (
    <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
      <Link href="/mypage/tailoredportfolio">
        <button
          className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] grid justify-center cursor-pointer
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
          </div>

          <div className=" w-[439px] h-[60px]">
            <div className="flex mb-[12px]">
              <div
                className="text-[16px] text-[#898989] mr-[20px] ml-[12px]
              max-lg:ml-[36px]"
              >
                진행 기간
              </div>
              <div className="text-[16px] text-black ">25.04~25.06</div>
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
