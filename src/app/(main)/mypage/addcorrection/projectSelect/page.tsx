'use client';

import Projects from '@/features/mypage/components/Projects';
import Link from 'next/link';

export default function ProjectSelect() {
  return (
    <div className="ml-[80px] ">
      <div className="flex flex-col items-center">
        <div className="w-[1323px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[12px] font-semibold text-[20px]">
          AI 지원 맞춤 포트폴리오 첨삭
        </div>
        <div className="w-[1359px] h-[970px] bg-[#F8F8F8] rounded-[16px] relative">
          <div className="flex items-start ml-[60px] mt-[32px]">
            <img src="/icons/AiLogo.svg" alt="AI 로고" className="translate-y-[34px]" />

            <div className="relative ml-[28px] ">
              <img src="/icons/ProjectSelectBubble.svg" alt="로딩중 말풍선" />
              <div className="absolute top-[0px] left-[0px] py-[42px] px-[90px] text-[18px]">
                <p>어떤 프로젝트의 내용을 포트폴리오로 제출하려고 하시나요?</p>
                <p>선택하신 프로젝트의 마스터 포트폴리오를 바탕으로 첨삭을 진행할게요.</p>
                <div className="flex mt-[36px]">
                  <p className="font-semibold">최대 6개</p>
                  <p>의 프로젝트까지 선택 가능해요.</p>
                </div>
                <div className="border border-[#BBBBBB] rounded-[12px] w-[1008px] h-[506px] mt-[24px] px-[24px] py-[24px]">
                  <Projects />
                </div>
              </div>
            </div>
          </div>

          <div className="relative ml-[1068px] mt-[20px]">
            <img src="/icons/NextPageBubble.svg" alt="다음으로 말풍선" />
            <Link href="/mypage/tailoredportfolio">
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
