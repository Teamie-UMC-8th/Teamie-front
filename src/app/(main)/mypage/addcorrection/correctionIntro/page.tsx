'use client';

import CorrectionStartButton from '@/features/correction/components/CorrectionStartButton';
import Link from 'next/link';

export default function CorrectionIntro() {
  /* TODO: Sidebar 제거 후 간격 재조정 */
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
              <img src="/icons/TitleBubble.svg" alt="말풍선" />
              <div className="absolute top-[0px] left-[0px] text-[18px] text-black py-[44px] px-[104px] max-w-[1100px]">
                <p className="font-semibold">
                  안녕하세요! 두현우님의 포트폴리오를 첨삭할 AI, 티미입니다.
                </p>
                <p className="mt-[36px]">
                  지원하고자 하는 기업명, 직무명, 그리고 해당 포지션의 Job Description을
                  입력해주시면, 기업 분석 정보를 생성할게요.
                </p>
                <p className="mt-[36px]">
                  JD (Job Description)는 채용공고에 명시된 직무 설명서로, 회사에서 어떤 일을 할
                  사람을 찾고 있는지, 그 사람이 어떤 능력을 가져야 하는지 정리한 글이에요.
                </p>
                <p>주로 담당할 업무, 자격요건, 우대사항 등이 포함돼요.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute right-7 mt-[16px] ">
              <img src="/icons/SubBubble.svg" alt="말풍선" />
              <div className="absolute top-[40px] left-[50px] flex-col">
                <p className="font-semibold text-[18px] ">기업명</p>
                <input className="border border-[#BBBBBB] w-[645px] h-[42px] rounded-[4px] mt-[2px] px-[12px]" />
                <p className="font-semibold text-[18px] mt-[16px]">직무명</p>
                <input className="border border-[#BBBBBB] w-[645px] h-[42px] rounded-[4px] mt-[2px] px-[12px]" />
                <p className="font-semibold text-[18px] mt-[16px]">Job Description</p>
                <textarea className="border border-[#BBBBBB] w-[645px] h-[64px] rounded-[4px] mt-[2px] px-[12px] py-[10px] " />

                <CorrectionStartButton
                  onStart={() => {
                    // 시작 로직 작성
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
