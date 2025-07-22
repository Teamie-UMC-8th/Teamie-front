'use client';

import Link from 'next/link';

export default function AiLoadingPage() {
  return (
    <div className="ml-[80px] ">
      <div className="flex flex-col items-center">
        <div className="w-[1323px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[12px] font-semibold text-[20px]">
          AI 지원 맞춤 포트폴리오 첨삭
        </div>
        <div className="w-[1359px] h-[800px] bg-[#F8F8F8] rounded-[16px] relative">
          <div className="flex items-start ml-[60px] mt-[32px]">
            <img src="/icons/AiLogo.svg" alt="AI 로고" className="translate-y-[34px]" />
            <div className="relative ml-[28px]">
              <img src="/icons/LoadingBubble.svg" alt="로딩중 말풍선" />

              <div className="absolute top-[0px] left-[0px] py-[54px] px-[94px]">
                <div className="flex text-[18px] items-center">
                  <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                  <p className="mr-[4px]">Analyzing</p>
                  <p className="mr-[4px]">기업명</p>
                  <p>
                    ’s company profile to understand its culture, vision, strengths, and weaknesses.
                  </p>
                </div>
                <div className="border-l-[2px] border-[#E7E7E7] h-[32px] ml-[4px]" />
                <div className="flex text-[18px] items-center">
                  <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                  <p className="mr-[4px]">검색 중</p>
                </div>
                <div className="flex">
                  <div className="border-l-[2px] border-[#E7E7E7] h-[135px] ml-[4px] mr-[21px]" />
                  <div className="border border-[#BBBBBB] rounded-[6px] bg-[#F8F8F8] mt-[6px] w-[94px] h-[36px] px-[12px] py-[6px] flex items-center">
                    <img src="/icons/SearchIcon.svg" alt="검색 아이콘" className="mr-[2px]" />
                    <p className="text-[16px]">검색어</p>
                  </div>
                </div>
                <div className="flex text-[18px] items-center">
                  <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                  <p className="mr-[4px]">응답 읽는 중</p>
                </div>
                <div className="border border-[#BBBBBB] rounded-[8px] bg-[#F8F8F8] w-[828px] h-[206px] ml-[24px] mt-[6px] p-[12px]">
                  <div className="flex items-center">
                    <img src="/icons/URLIcon.svg" alt="URL 아이콘" className="mr-[8px]" />
                    <p>URL주소주소주소주소주소주소주소주소주소주소주소</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative ml-[1068px] mt-[20px]">
            <img src="/icons/NextPageBubble.svg" alt="다음으로 말풍선" />
            <Link href="/mypage/addcorrection/analyzefin">
              <img
                src="/icons/NextPage.svg"
                alt="다음으로"
                className="absolute top-[36px] left-[52px] cursor-pointer"
              />
            </Link>
          </div>
          <div className="relative ml-[1068px] mt-[20px]">
            <img src="/icons/NextPageBubble.svg" alt="다음으로 말풍선" />
            <img
              src="/icons/NextPageOff.svg"
              alt="다음으로"
              className="absolute top-[36px] left-[52px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
