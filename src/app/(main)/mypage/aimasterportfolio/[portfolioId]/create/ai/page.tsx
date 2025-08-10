'use client';

import { useState, useEffect, useRef } from 'react';
import StepsSidebar from '@/features/aimasterportfolio/components/StepSidebar';
import Portal from '@/components/Portal';
import { useFunnel } from '@/features/aimasterportfolio/hooks/useFunnel';
import Image from 'next/image';
import Step1 from '@/features/aimasterportfolio/components/steps/Step1';
import Step2 from '@/features/aimasterportfolio/components/steps/Step2';
import Step3, { type Step3Handle } from '@/features/aimasterportfolio/components/steps/Step3';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import AIConfirmModal from '@/features/aimasterportfolio/components/AIConfirmModal';
import { usePostMasterPortfolioQuestions } from '@/hooks/mutations/usePostMasterPortfolioQuestions';
import { useMasterPortfolioDetail } from '@/hooks/queries/useGetMasterPortfolio';
import { useGetPersonalRetro } from '@/hooks/queries/useGetPersonalRetro';
import { usePatchMasterPortfolio } from '@/hooks/mutations/usePatchMasterPortfolio';
import { usePatchMasterPortfolioQuestions } from '@/hooks/mutations/usePatchMasterPortfolioQuestions';
import { useQueryClient } from '@tanstack/react-query';

const AI_CREATE_STEPS = [
  {
    id: 1,
    title: '개인 회고 작성',
    buttons: {
      sub: '개인 회고로 이동',
      main: (
        <span className="font-[Pretendard] font-bold text-[18px] leading-[26px] text-center w-full">
          다음으로 →
        </span>
      ),
    },
  },
  {
    id: 2,
    title: '회의록 선택',
    buttons: {
      sub: '← 이전으로',
      main: (
        <span className="font-[Pretendard] font-bold text-[18px] leading-[26px] text-center w-full">
          다음으로 →
        </span>
      ),
    },
  },
  {
    id: 3,
    title: '추가 질문',
    buttons: {
      sub: '임시저장',
      main: (
        <span className="font-[Pretendard] font-bold text-[18px] leading-[26px] text-center w-full">
          AI 마스터 포트폴리오 생성하기
        </span>
      ),
    },
  },
];

export default function AIMasterPortfolioCreatePage() {
  const router = useRouter();
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const searchParams = useSearchParams();
  const initialStep = searchParams.get('step');
  const { currentStep, goToStep } = useFunnel({ initialStep: Number(initialStep) });
  const [scrollY, setScrollY] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formAnswers, setFormAnswers] = useState({
    projectGoal: null as boolean | null,
    workDomain: null as boolean | null,
    workDomainDetail: '',
    achievement: null as boolean | null,
    roleContribution: null as boolean | null,
    roleContributionDetail: '',
  });
  const step3Ref = useRef<Step3Handle>(null);
  const { mutate } = usePostMasterPortfolioQuestions();
  const { data: portfolio } = useMasterPortfolioDetail(Number(portfolioId));
  const { data: retro } = useGetPersonalRetro(portfolio?.projectId as number);
  const { mutate: patchQuestions, isPending: isPatchQuestionsPending } =
    usePatchMasterPortfolioQuestions();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sidebarPaddingTop = Math.max(0, 56 - scrollY);

  // 1. 회고 데이터가 채워졌는지 확인하는 함수
  const isRetroDataComplete = () => {
    if (!retro) return false; // retro 데이터가 없으면 false 반환

    const { collaborationProfile, memorableExperience, strengthsAndGrowth } = retro;

    return (
      collaborationProfile?.trim() || memorableExperience?.trim() || strengthsAndGrowth?.trim() // 근데 3항목 중 한 개씩 차있어야 하는 거면 &&을 써야하는 거 아닌가
    ); // 세 항목 중 하나라도 값이 있다면 true 반환
  };

  // 2. 메인 버튼을 비활성화할지 판단하는 함수
  const isMainButtonDisabled = () => {
    return currentStep === 0 && !isRetroDataComplete();
  };

  const handleMainButtonClick = () => {
    if (currentStep === 2) {
      mutate(
        { portfolioId: Number(portfolioId), recordIdList: [] },
        {
          onSuccess: () => setShowConfirmModal(true),
          onError: (error) => {
            console.error('질문 생성 실패:', error);
            alert('질문 생성 중 오류가 발생했습니다.');
          },
        }
      );
    } else {
      goToStep(currentStep + 1);
    }
  };

  const handleSubButtonClick = () => {
    if (currentStep === 0) {
      router.replace(`/projects/${portfolio?.projectId}/retrospect/create`);
    } else if (currentStep === 2) {
      // 임시저장 실행 - Step3의 모든 폼 데이터 반영 (질문 업데이트)
      const payload = step3Ref.current?.buildDraftPayload() ?? [];
      if (payload.length === 0) {
        alert('변경 사항이 없습니다.');
        return;
      }

      patchQuestions(
        {
          portfolioId: Number(portfolioId),
          body: payload,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['master-portfolio-questions', Number(portfolioId)],
            });
            alert('임시저장이 완료되었습니다.');
          },
          onError: (error) => {
            console.error('임시저장 실패:', error);
            alert('임시저장 중 오류가 발생했습니다.');
          },
        }
      );
    } else {
      goToStep(currentStep - 1);
    }
  };

  return (
    <>
      <Portal as="aside" containerId="step-sidebar">
        <div
          className="fixed top-0 left-0 h-full bg-white shadow-lg z-1
          max-lg:w-full max-lg:h-[108px]
          max-lg:border-none
          max-lg:justify-end"
          style={{ paddingTop: `${sidebarPaddingTop}px` }}
        >
          <StepsSidebar currentStep={currentStep} steps={AI_CREATE_STEPS} goToStep={goToStep} />
        </div>
      </Portal>

      <div className="ml-0 max-lg:ml-0]">
        <main className="flex flex-col gap-0 max-w-[1323px] mx-auto p-6">
          <section className="max-lg:mt-[120px] w-[1323px] max-lg:w-[908px] h-[52px] flex items-center justify-between bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[8px] mr-[12px] ml-[12px]">
            <h2 className="text-[20px] leading-[28px] font-semibold text-[#000000] font-[Pretendard]">
              AI 마스터 포트폴리오 생성
            </h2>
          </section>

          <div className="flex flex-col w-[1359px] max-lg:w-[928px] h-[800px] max-lg:h-[732px] rounded-[16px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.20)] p-[40px] gap-[32px] overflow-y-auto">
            <div className="flex flex-col gap-[40px] items-end">
              <div className="flex items-start gap-[40px] w-full">
                <img
                  src="/icons/AITeamieChatIcon.svg"
                  alt="티미 채팅 아이콘"
                  className="w-[80px] max-lg:w-[60px] h-[80px] max-lg:h-[60px] mt-[24px]"
                />
                <div className="relative w-full h-full">
                  <div className="w-full h-full bg-white border-none rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.10)] p-[50px] max-lg:px-[36px] max-lg:py-[32px] max-lg:text-[16px] max-lg:leading-[24px]">
                    {currentStep === 0 && <Step1 />}
                    {currentStep === 1 && <Step2 />}
                    {currentStep === 2 && <Step3 ref={step3Ref} />}
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

              <div className="relative w-fit h-full">
                <div className="w-fit h-full bg-white border-none rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.10)] px-[34px] py-[24px] flex gap-[16px]">
                  <button
                    className="rounded-[6px] border-[1.5px] border-[#898989] bg-[#FFF] p-[6px] px-[32px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubButtonClick}
                    disabled={currentStep === 2 && isPatchQuestionsPending}
                  >
                    {AI_CREATE_STEPS[currentStep].buttons.sub}
                  </button>

                  <button
                    className="rounded-[6px] border-[1px] border-[#81D7D4] bg-[#81D7D4] p-[6px] px-[32px] text-[#FFF] cursor-pointer  disabled:opacity-50"
                    onClick={handleMainButtonClick}
                    disabled={isMainButtonDisabled()}
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

      {showConfirmModal && (
        <AIConfirmModal
          onConfirm={() => {
            router.push(`/mypage/aimasterportfolio/${portfolioId}/final`);
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
