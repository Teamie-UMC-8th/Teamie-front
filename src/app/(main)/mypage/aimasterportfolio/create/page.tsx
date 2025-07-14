'use client';

import { useState, useEffect } from 'react';
import StepsSidebar from '@/features/aimasterportfolio/components/StepSidebar';
import Portal from '@/components/Portal';
import { useFunnel } from '@/features/aimasterportfolio/hooks/useFunnel';
import Image from 'next/image';
import Step1 from '@/features/aimasterportfolio/components/steps/Step1';
import Step2 from '@/features/aimasterportfolio/components/steps/Step2';
import Step3 from '@/features/aimasterportfolio/components/steps/Step3';
import { useRouter } from 'next/navigation';

const AI_CREATE_STEPS = [
  {
    id: 1,
    title: '개인 회고 작성',
    buttons: {
      sub: '개인 회고로 이동',
      main: '다음으로 →',
    },
  },
  {
    id: 2,
    title: '회의록 선택',
    buttons: {
      sub: '← 이전으로',
      main: '다음으로 →',
    },
  },
  {
    id: 3,
    title: '추가 질문',
    buttons: {
      sub: '임시저장',
      main: 'AI 마스터 포트폴리오 생성하기',
    },
  },
];

export default function AIMasterPortfolioCreatePage() {
  const router = useRouter();
  const { currentStep, goToStep } = useFunnel();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const sidebarPaddingTop = Math.max(0, 56 - scrollY);

  return (
    <>
      <Portal as="aside" containerId="step-sidebar">
        <div
          className="fixed top-0 left-0 h-full bg-white shadow-lg z-1"
          style={{ paddingTop: `${sidebarPaddingTop}px` }}
        >
          <StepsSidebar currentStep={currentStep} steps={AI_CREATE_STEPS} goToStep={goToStep} />
        </div>
      </Portal>

      <div className="ml-[300px]">
        <main className="flex flex-col gap-0 max-w-[1600px] mx-auto p-6">
          <section className="flex items-center justify-between bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[8px] mr-[12px] ml-[12px]">
            <h2 className="text-[20px] leading-[28px] font-semibold text-[#000000] font-[Pretendard]">
              AI 마스터 포트폴리오 생성
            </h2>
          </section>

          <div className="flex flex-col w-full h-[804px] rounded-[16px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.20)] p-[40px] gap-[32px] overflow-y-auto">
            <div className="flex flex-col gap-[40px] items-end">
              <div className="flex items-start gap-[40px] w-full">
                <div className="w-[80px] h-[80px] bg-[#D9D9D9] mt-[24px]" />

                {/* 첫번째 버블 */}
                <div className="relative w-[100%] h-[100%]">
                  <div className="w-[100%] h-[100%] bg-white border-none rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.10)] p-[50px]">
                    {currentStep === 0 && <Step1 />}
                    {currentStep === 1 && <Step2 />}
                    {currentStep === 2 && <Step3 />}
                  </div>
                  <Image
                    className="absolute top-[0] left-[-6px] translate-x-[-50%] translate-y-[50%]"
                    src="/icons/spike-left.svg"
                    alt="spike-left"
                    width={30}
                    height={30}
                  />
                </div>
              </div>

              {/* 두번째 버블 */}
              <div className="relative w-fit h-[100%]">
                <div className="w-fit h-[100%] bg-white border-none rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.10)] px-[34px] py-[24px] flex gap-[16px]">
                  <button
                    className="rounded-[6px] border-[1px] border-[#898989] bg-[#FFF] p-[6px] px-[32px] cursor-pointer"
                    onClick={() => {
                      if (currentStep === 0) {
                        router.push('/mypage/aimasterportfolio');
                      } else {
                        goToStep(currentStep - 1);
                      }
                    }}
                  >
                    {AI_CREATE_STEPS[currentStep].buttons.sub}
                  </button>
                  <button
                    className="rounded-[6px] border-[1px] border-[#81D7D4] bg-[#81D7D4] p-[6px] px-[32px] text-[#FFF] cursor-pointer"
                    onClick={() => goToStep(currentStep + 1)}
                  >
                    {AI_CREATE_STEPS[currentStep].buttons.main}
                  </button>
                </div>
                <Image
                  className="absolute top-[0] right-[-6px] translate-x-[50%] translate-y-[50%]"
                  src="/icons/spike-right.svg"
                  alt="spike-right"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
