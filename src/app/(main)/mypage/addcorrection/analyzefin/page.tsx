'use client';

import Link from 'next/link';

export default function Analyzefin() {
  return (
    <div
      className="ml-[80px]
    max-lg:ml-[24px]"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-[1323px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[12px] font-semibold text-[20px]
        max-lg:w-[908px]"
        >
          AI 지원 맞춤 포트폴리오 첨삭
        </div>
        <div
          className="w-[1359px] h-[800px] bg-[#F8F8F8] rounded-[16px] relative
        max-lg:w-[928px] max-lg:h-[878px]"
        >
          <div
            className="flex items-start ml-[60px] mt-[32px]
          max-lg:ml-[32px] max-lg:mt-[8px]"
          >
            <img
              src="/icons/AiLogo.svg"
              alt="AI 로고"
              className="translate-y-[34px]
            max-lg:w-[60px] max-lg:h-[60px] max-lg:translate-y-[32px]"
            />

            <div
              className="relative ml-[28px]
            max-lg:ml-[8px]"
            >
              <img
                src="/icons/AnalyzeFinishBubble.svg"
                alt="분석 완료 말풍선"
                className="block max-lg:hidden"
              />
              <img
                src="/icons/ResponsiveAnalyzeFinishBubble.svg"
                alt="반응형 분석 완료 말풍선"
                className="hidden max-lg:block"
              />
              <div
                className="absolute top-[0px] left-[0px] py-[42px] px-[90px] text-[18px]
              max-lg:px-[92px] max-lg:py-[36px]"
              >
                <p>기업 분석이 완료되었습니다.</p>
                <p>해당 내용을 바탕으로 첨삭을 진행할게요.</p>
              </div>
            </div>
          </div>

          <div
            className="relative ml-[1068px] mt-[20px]
          max-lg:ml-[660px]"
          >
            <img src="/icons/NextPageBubble.svg" alt="다음으로 말풍선" />
            <Link href="/mypage/addcorrection/projectSelect">
              <img
                src="/icons/NextPage.svg"
                alt="다음으로"
                className="absolute top-[36px] left-[52px] cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
