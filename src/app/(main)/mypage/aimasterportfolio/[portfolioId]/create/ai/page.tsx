'use client';

import { useState, useEffect, useRef } from 'react';
import StepsSidebar from '@/features/aimasterportfolio/components/StepSidebar';
import Portal from '@/components/Portal';
import { useFunnel } from '@/features/aimasterportfolio/hooks/useFunnel';
import Image from 'next/image';
import Step1 from '@/features/aimasterportfolio/components/steps/Step1';
import Step2 from '@/features/aimasterportfolio/components/steps/Step2';
import Step3, { type Step3Handle } from '@/features/aimasterportfolio/components/steps/Step3';
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation';
import AIConfirmModal from '@/features/aimasterportfolio/components/AIConfirmModal';
import LoadingModal from '@/features/aimasterportfolio/components/MasterLoadingModal';
import {
  useMasterPortfolioDetail,
  useMasterPortfolioStatus,
} from '@/hooks/queries/useGetMasterPortfolio';
import { useGetPersonalRetro } from '@/hooks/queries/useGetPersonalRetro';
import { usePatchMasterPortfolioQuestions } from '@/hooks/mutations/usePatchMasterPortfolioQuestions';
import { useQueryClient } from '@tanstack/react-query';
import { usePostMasterPortfolioGenerate } from '@/hooks/mutations/usePostMasterPortfolioGenerate';
import { usePostMasterPortfolioQuestions } from '@/hooks/mutations/usePostMasterPortfolioQuestions';

const STEP_TITLES = ['개인 회고 작성', '회의록 선택', '추가 질문'] as const;
const STEPS_FOR_SIDEBAR = STEP_TITLES.map((title, idx) => ({ id: idx + 1, title }));

export default function AIMasterPortfolioCreatePage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const portfolioId = Number(params.portfolioId);

  const { data: portfolio } = useMasterPortfolioDetail(portfolioId);
  const { data: statusData } = useMasterPortfolioStatus(portfolioId);
  const { data: retro } = useGetPersonalRetro(portfolio?.projectId as number);
  const { mutate: patchQuestions, isPending: isPatchQuestionsPending } =
    usePatchMasterPortfolioQuestions();
  const queryClient = useQueryClient();
  const { mutate: generate } = usePostMasterPortfolioGenerate();
  const { mutate: postQuestions } = usePostMasterPortfolioQuestions();

  const { currentStep, goToStep } = useFunnel({ initialStep: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
  const step3Ref = useRef<Step3Handle>(null);
  const [isPostingQuestions, setIsPostingQuestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sidebarPaddingTop = Math.max(0, 56 - scrollY);
  const status = statusData?.result?.status as string | undefined;
  const stepParam = searchParams.get('step');
  const requiredStep = status === 'NEED_ANSWERS' ? 3 : status === 'DONE' ? 0 : 1;
  const minStepIndex = Math.max(0, requiredStep - 1);

  useEffect(() => {
    setSynced(false);
    if (!status) return;

    if (status === 'DONE') {
      router.replace(`/mypage/aimasterportfolio/${portfolioId}`);
      return;
    }

    let changed = false;
    const stepNum = stepParam ? Number(stepParam) : NaN;
    if (!stepParam || Number.isNaN(stepNum) || stepNum < requiredStep) {
      router.replace(`${pathname}?step=${requiredStep}`);
      changed = true;
    }

    if (currentStep < minStepIndex) {
      goToStep(minStepIndex);
      changed = true;
    }

    if (!changed) setSynced(true);
  }, [
    status,
    stepParam,
    requiredStep,
    pathname,
    currentStep,
    minStepIndex,
    portfolioId,
    router,
    goToStep,
  ]);

  // 초기 로딩/정규화 중에는 깜빡임 방지를 위해 렌더 지연
  if (!status || !synced) return null;

  const isRetroDataComplete = () => {
    if (!retro) return false;
    const { collaborationProfile, memorableExperience, strengthsAndGrowth } = retro;
    return (
      collaborationProfile?.trim() && memorableExperience?.trim() && strengthsAndGrowth?.trim()
    );
  };

  const isMainButtonDisabled = () => currentStep === 0 && !isRetroDataComplete();

  const safeGoToStep = (target: number) => {
    goToStep(Math.max(target, minStepIndex));
  };

  const handleMainButtonClick = () => {
    if (currentStep === 2) {
      setShowConfirmModal(true);
    } else if (currentStep === 1) {
      if (isPostingQuestions) return;
      setIsPostingQuestions(true);
      postQuestions(
        { portfolioId, recordIdList: selectedRecordIds },
        {
          onSuccess: () => {
            safeGoToStep(currentStep + 1);
            queryClient.invalidateQueries({
              queryKey: ['master-portfolio-questions', portfolioId],
            });
          },
          onSettled: () => setIsPostingQuestions(false),
        }
      );
    } else {
      safeGoToStep(currentStep + 1);
    }
  };

  const handleSubButtonClick = () => {
    if (currentStep === 0) {
      if (portfolio?.projectId)
        router.replace(`/projects/${portfolio.projectId}/retrospect/create`);
    } else if (currentStep === 2) {
      const payload = step3Ref.current?.buildDraftPayload() ?? [];
      if (Array.isArray(payload) && payload.length === 0) {
        alert('변경 사항이 없습니다.');
        return;
      }

      patchQuestions(
        { portfolioId, body: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['master-portfolio-questions', portfolioId],
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
      safeGoToStep(currentStep - 1);
    }
  };

  return (
    <>
      <Portal as="aside" containerId="step-sidebar">
        <div
          className="fixed top-0 left-0 h-full bg-white shadow-lg z-[1]
          max-lg:w-full max-lg:h-[108px]
          max-lg:border-none
          max-lg:justify-end"
          style={{ paddingTop: `${sidebarPaddingTop}px` }}
        >
          <StepsSidebar
            currentStep={currentStep}
            steps={STEPS_FOR_SIDEBAR}
            goToStep={safeGoToStep}
          />
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
                <Image
                  src="/icons/AITeamieChatIcon.svg"
                  alt="티미 채팅 아이콘"
                  width={80}
                  height={80}
                  className="w-[80px] max-lg:w-[60px] h-[80px] max-lg:h-[60px] mt-[24px]"
                />
                <div className="relative w-full h-full">
                  <div className="w-full h-full bg-white border-none rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.10)] p-[40px] max-lg:px-[36px] max-lg:py-[32px] max-lg:text-[16px] max-lg:leading-[24px]">
                    {currentStep === 0 && <Step1 />}
                    {currentStep === 1 && (
                      <Step2
                        onChangeSelectedIds={setSelectedRecordIds}
                        selectedIds={selectedRecordIds}
                      />
                    )}
                    {currentStep === 2 && <Step3 ref={step3Ref} />}
                  </div>
                  <Image
                    className="absolute top-0 left-[-6px] translate-x-[-50%] translate-y-[50%]"
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
                    className="rounded-[6px] font-semibold border-[1px] border-[#898989] bg-[#FFF] p-[6px] px-[32px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubButtonClick}
                    disabled={
                      (currentStep === 2 && isPatchQuestionsPending) ||
                      isPostingQuestions ||
                      isGenerating
                    }
                  >
                    {currentStep === 0
                      ? '개인 회고로 이동'
                      : currentStep === 1
                        ? '← 이전으로'
                        : '임시저장'}
                  </button>

                  <button
                    className="rounded-[6px] font-semibold border-[1px] border-[#81D7D4] bg-[#81D7D4] p-[6px] px-[32px] text-[#FFF] cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[120px] h-[40px]"
                    onClick={handleMainButtonClick}
                    disabled={isMainButtonDisabled() || isPostingQuestions || isGenerating}
                  >
                    {currentStep === 2 ? (
                      isGenerating ? (
                        '생성 중…'
                      ) : (
                        <div className="flex items-center gap-[10px]">
                          <span className="relative w-[36px] h-[36px]">
                            <Image
                              src="/icons/backgroundCoin.svg"
                              alt="coin-bg"
                              width={24}
                              height={24}
                              className="w-[36px] h-[36px]"
                            />
                            <Image
                              src="/icons/coin.svg"
                              alt="coin"
                              width={32}
                              height={32}
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px]"
                            />
                          </span>
                          <span>AI 마스터 포트폴리오 생성하기</span>
                        </div>
                      )
                    ) : isPostingQuestions ? (
                      <img
                        src="/icons/nextLoading.svg"
                        alt="로딩"
                        className="w-[20px] h-[20px] animate-spin"
                      />
                    ) : (
                      '다음으로 →'
                    )}
                  </button>
                </div>
                <Image
                  className="absolute top-0 right-[-6px] translate-x-[50%] translate-y-[50%]"
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
          confirmText="생성"
          cancelText="취소"
          isLoading={isGenerating}
          disableConfirm={isGenerating}
          disableCancel={isGenerating}
          onConfirm={() => {
            if (isGenerating) return;
            setIsGenerating(true);
            // 생성 시작과 동시에 확인 모달을 닫아 중첩 표시를 방지
            setShowConfirmModal(false);
            const payload = step3Ref.current?.buildDraftPayload() ?? [];
            patchQuestions(
              { portfolioId, body: payload },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ['master-portfolio-questions', portfolioId],
                  });
                  generate(
                    { portfolioId },
                    {
                      onSuccess: () => setShowConfirmModal(false),
                      onError: (error) => {
                        console.error('포트폴리오 생성 실패:', error);
                        alert('포트폴리오 생성 중 오류가 발생했습니다.');
                        setIsGenerating(false);
                      },
                      onSettled: () => setIsGenerating(false),
                    }
                  );
                },
                onError: (error) => {
                  console.error('임시저장 실패:', error);
                  alert('임시저장 중 오류가 발생했습니다.');
                  setIsGenerating(false);
                },
              }
            );
          }}
          onCancel={() => {
            if (isGenerating) return;
            setShowConfirmModal(false);
          }}
        />
      )}

      {isGenerating && <LoadingModal isOpen />}
    </>
  );
}
