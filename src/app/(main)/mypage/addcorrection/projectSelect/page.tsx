'use client';

import Projects from '@/features/mypage/components/Projects';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import MasterLoadingModal from '@/features/aimasterportfolio/components/MasterLoadingModal';
import { fetchGeneratedCorrection, postGenerateCorrection } from '@/services/correction/correction';
// 상태 프리체크는 hasMasterPortfolio로 대체
import { AxiosError, isAxiosError } from 'axios';
import Image from 'next/image';

export default function ProjectSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const correctionIdFromQuery =
    Number(searchParams.get('correctionId')) || Number(searchParams.get('id'));
  const submissionTarget = searchParams.get('submissionTarget') || '';
  const correctionId = useMemo(() => {
    if (Number.isFinite(correctionIdFromQuery) && correctionIdFromQuery > 0)
      return correctionIdFromQuery;
    try {
      const last = Number(sessionStorage.getItem('lastCorrectionId'));
      return Number.isFinite(last) ? last : NaN;
    } catch {
      return correctionIdFromQuery;
    }
  }, [correctionIdFromQuery]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 선택된 항목 읽기: portfolioId 배열, projectId 배열, 그리고 매핑 쌍
  const getSelectedPortfolioIds = (): number[] => {
    try {
      const raw = sessionStorage.getItem('projectSelect:selected');
      const arr = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(arr)
        ? arr
            .slice(0, 6)
            .map((n) => Number(n))
            .filter(Number.isFinite)
        : [];
    } catch {
      return [];
    }
  };

  const getSelectedProjectIds = (): number[] => {
    try {
      const raw = sessionStorage.getItem('projectSelect:selectedProjectIds');
      const arr = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(arr)
        ? arr
            .slice(0, 6)
            .map((n) => Number(n))
            .filter(Number.isFinite)
        : [];
    } catch {
      return [];
    }
  };

  const getSelectedPairs = (): Array<{ portfolioId: number; projectId: number }> => {
    try {
      const raw = sessionStorage.getItem('projectSelect:selectedPairs');
      const arr = raw ? (JSON.parse(raw) as unknown) : [];
      if (!Array.isArray(arr)) return [];
      const pairs = arr
        .map((p: unknown) => {
          if (typeof p === 'object' && p !== null) {
            const obj = p as { portfolioId?: unknown; projectId?: unknown };
            const portfolioId = Number(obj.portfolioId);
            const projectId = Number(obj.projectId);
            return { portfolioId, projectId };
          }
          return { portfolioId: NaN, projectId: NaN };
        })
        .filter((p) => Number.isFinite(p.portfolioId) && Number.isFinite(p.projectId))
        .slice(0, 6);
      return pairs;
    } catch {
      return [];
    }
  };

  const waitUntilGenerated = useCallback(async (id: number) => {
    const maxWaitMs = 120000; // 2분
    const start = Date.now();
    while (true) {
      const result = await fetchGeneratedCorrection(id).catch(() => null);
      if (
        result &&
        Array.isArray(result.projects) &&
        result.projects.length > 0 &&
        result.firstCorrection
      ) {
        try {
          sessionStorage.setItem(`generatedCorrection:${id}`, JSON.stringify(result));
        } catch {}
        return result;
      }
      if (Date.now() - start > maxWaitMs) throw new Error('Timeout waiting for generated data.');
      await new Promise((res) => setTimeout(res, 2000));
    }
  }, []);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    const pairs = getSelectedPairs();
    const portfolioIds = pairs.map((p) => p.portfolioId);
    // 하위 호환: 만약 pairs가 비어있다면, 기존 방식 사용
    const fallbackPortfolioIds = portfolioIds.length > 0 ? portfolioIds : getSelectedPortfolioIds();
    if (!correctionId || (pairs.length === 0 && fallbackPortfolioIds.length === 0)) return;
    try {
      setIsGenerating(true);
      // hasMasterPortfolio를 기반으로 Projects에서 이미 필터링했으므로 그대로 projectId 사용
      const readyProjectIds = (
        pairs.length > 0 ? pairs.map((p) => p.projectId) : getSelectedProjectIds()
      )
        .slice(0, 6)
        .map((n) => Number(n))
        .filter(Number.isFinite);
      if (readyProjectIds.length === 0) {
        alert('선택된 프로젝트가 없습니다. 프로젝트를 선택해 주세요.');
        setIsGenerating(false);
        return;
      }
      await postGenerateCorrection(correctionId, { selectedProjects: readyProjectIds });
      await waitUntilGenerated(correctionId);
      const query = submissionTarget
        ? `?submissionTarget=${encodeURIComponent(submissionTarget)}`
        : '';
      router.push(`/mypage/tailoredportfolio/${correctionId}${query}`);
    } catch (err: unknown) {
      console.error('[ProjectSelect] generate failed:', err);
      let reason: string | undefined;
      let dataMsg: string | undefined;
      let message: string | undefined;
      if (isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ error?: { reason?: string; data?: string } }>;
        reason = axiosErr.response?.data?.error?.reason;
        dataMsg = axiosErr.response?.data?.error?.data;
        message = axiosErr.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      alert(
        `첨삭 생성에 실패했습니다.${reason ? `\n사유: ${reason}` : ''}${
          dataMsg ? `\n${dataMsg}` : ''
        }${message ? `\n메시지: ${message}` : ''}`
      );
      setIsGenerating(false);
    }
  };
  return (
    <div
      className="ml-[300px]
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
          className="w-[1359px] h-[970px] bg-[#F8F8F8] rounded-[16px] relative
        max-lg:w-[928px] max-lg:h-[947px]"
          style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
        >
          <div
            className="flex items-start ml-[60px] mt-[32px]
          max-lg:ml-[32px] max-lg:mt-[8px]"
          >
            <Image
              src="/icons/AiCharacter.svg"
              alt="AI 로고"
              width={60}
              height={60}
              className="translate-y-[34px]
            max-lg:w-[60px] max-lg:h-[60px] max-lg:translate-y-[32px]"
            />

            <div
              className="relative ml-[28px]
            max-lg:ml-[8px]"
            >
              <Image
                src="/icons/ProjectSelectBubble.svg"
                alt="로딩중 말풍선"
                width={0}
                height={0}
                sizes="100vw"
                className="block max-lg:hidden"
                style={{ width: 'auto', height: 'auto' }}
              />
              <Image
                src="/icons/ResponsiveProjectSelectBubble.svg"
                alt="반응형 프로젝트 선택 말풍선"
                width={0}
                height={0}
                sizes="100vw"
                className="hidden max-lg:block"
                style={{ width: 'auto', height: 'auto' }}
              />
              <div
                className="absolute top-[0px] left-[0px] py-[42px] px-[90px] text-[18px]
              max-lg:text-[16px]"
              >
                <p>어떤 프로젝트의 내용을 포트폴리오로 제출하려고 하시나요?</p>
                <p>선택하신 프로젝트의 마스터 포트폴리오를 바탕으로 첨삭을 진행할게요.</p>
                <div className="flex mt-[36px]">
                  <p className="font-semibold">최대 6개</p>
                  <p>의 프로젝트까지 선택 가능해요.</p>
                </div>
                <div
                  className="border border-[#898989] rounded-[12px] w-[1008px] h-[506px] mt-[24px] px-[24px] py-[24px] overflow-y-auto
                max-lg:mt-[50px] max-lg:w-[521px] max-lg:h-[512px] max-lg:px-[28px] max-lg:py-[24px] max-lg:ml-[57px]"
                >
                  <Projects />
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative ml-[920px] mt-[20px]
          max-lg:ml-[496px]"
          >
            <Image
              src="/icons/CorrectionStartBubble.svg"
              alt="첨삭 시작 말풍선"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: 'auto' }}
            />
            <button
              onClick={handleGenerate}
              className="absolute top-[36px] left-[52px] cursor-pointer"
            >
              <Image
                src="/icons/CorrectionStartButton.svg"
                alt="첨삭 시작 버튼"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: 'auto' }}
              />
            </button>
          </div>

          {isGenerating && <MasterLoadingModal isOpen startFromLast />}
        </div>
      </div>
    </div>
  );
}
