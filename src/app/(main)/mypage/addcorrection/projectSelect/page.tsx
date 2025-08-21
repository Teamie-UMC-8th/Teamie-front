'use client';

import Projects from '@/features/myPage/components/Projects';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import CorrectionLoadingModal from '@/features/correction/components/CorrectionLoadingModal';
import {
  fetchGeneratedCorrection,
  postGenerateCorrection,
  fetchCorrectionDetail,
} from '@/services/correction/correction';
// 상태 프리체크는 hasMasterPortfolio로 대체
import { AxiosError, isAxiosError } from 'axios';
import Image from 'next/image';

function ProjectSelectContent() {
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
  const [startFromLast, setStartFromLast] = useState(false);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const readSelectedCount = useCallback(() => {
    try {
      const raw = sessionStorage.getItem('projectSelect:selected');
      const arr = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  }, []);

  useEffect(() => {
    setSelectedCount(readSelectedCount());
  }, [readSelectedCount]);

  // 카드 내부 클릭이 stopPropagation되어도 즉시 반영되도록 캡처 단계에서 감지
  useEffect(() => {
    const update = () => setTimeout(() => setSelectedCount(readSelectedCount()), 0);
    document.addEventListener('click', update, true);
    document.addEventListener('keyup', update, true);
    return () => {
      document.removeEventListener('click', update, true);
      document.removeEventListener('keyup', update, true);
    };
  }, [readSelectedCount]);

  // 이 페이지를 마지막 방문 위치로 기록 (사용자가 어디에서 떠났는지 복귀 시 활용)
  useEffect(() => {
    if (!Number.isFinite(correctionId) || correctionId <= 0) return;
    try {
      // 인트로가 마지막 위치로 저장되어 있으면 우선권을 유지하고, 아니면 projectSelect로 기록
      if (!sessionStorage.getItem('correctionIntro:last')) {
        sessionStorage.setItem(`correctionReturn:${correctionId}`, 'projectSelect');
      }
    } catch {}
  }, [correctionId]);

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
      const result = await fetchGeneratedCorrection(id).catch((e) => {
        console.warn('[UI][GENERATE] polling generated failed (will retry)', e);
        return null;
      });
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

  // 생성 직후 상세 조회 가능해질 때까지 대기 (tailoredportfolio에서 사용되는 API)
  const waitUntilDetailReadable = useCallback(async (id: number) => {
    const maxWaitMs = 120000; // 2분
    const start = Date.now();
    let lastError: unknown = null;
    while (true) {
      try {
        const detail = await fetchCorrectionDetail(id);
        const ok = !!(
          detail &&
          typeof detail.createdAt === 'string' &&
          (detail.submissionTarget || '').toString() !== '' &&
          (detail.jobTitle || '').toString() !== ''
        );
        console.log('[UI][GENERATE] detail check', { ok, createdAt: detail?.createdAt });
        if (ok) return detail;
      } catch (e) {
        lastError = e;
      }
      if (Date.now() - start > maxWaitMs) {
        console.error('[UI][GENERATE] detail wait timeout', lastError);
        throw new Error('Timeout waiting for correction detail.');
      }
      await new Promise((res) => setTimeout(res, 1500));
    }
  }, []);

  const handleGenerate = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const pairs = getSelectedPairs();
    const portfolioIds = pairs.map((p) => p.portfolioId);
    // 하위 호환: 만약 pairs가 비어있다면, 기존 방식 사용
    const fallbackPortfolioIds = portfolioIds.length > 0 ? portfolioIds : getSelectedPortfolioIds();
    if (!correctionId || (pairs.length === 0 && fallbackPortfolioIds.length === 0)) return;
    try {
      setIsGenerating(true);
      setStartFromLast(false);
      try {
        sessionStorage.setItem(
          'correctionGenerating',
          JSON.stringify({ id: correctionId, startedAt: Date.now() })
        );
      } catch {}
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
      console.log('[UI][GENERATE] start', {
        correctionId,
        selectedProjects: readyProjectIds,
        selectedPairs: pairs,
      });
      await postGenerateCorrection(correctionId, { selectedProjects: readyProjectIds });
      console.log('[UI][GENERATE] posted, start polling for generated result');
      await waitUntilGenerated(correctionId);
      console.log('[UI][GENERATE] generated result ready, now wait for detail API to be readable');
      await waitUntilDetailReadable(correctionId);
      console.log('[UI][GENERATE] detail ready, navigate to tailored page');
      try {
        sessionStorage.removeItem('correctionGenerating');
        sessionStorage.removeItem(`correctionReturn:${correctionId}`);
      } catch {}
      const query = submissionTarget
        ? `?submissionTarget=${encodeURIComponent(submissionTarget)}`
        : '';
      router.push(`/myPage/tailoredPortfolio/${correctionId}${query}`);
    } catch (err: unknown) {
      console.error('[UI][GENERATE] failed', err);
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
      try {
        sessionStorage.removeItem('correctionGenerating');
      } catch {}
    }
  };

  // 페이지 재진입 시 진행 중 상태라면 마지막 단계부터 로딩 모달 표시하며 재개
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('correctionGenerating');
      if (!raw) return;
      const obj = JSON.parse(raw) as { id?: number; startedAt?: number } | null;
      if (!obj || !Number.isFinite(obj.id)) return;
      const id = Number(obj.id);
      if (!Number.isFinite(correctionId) || correctionId <= 0) return;
      if (id !== correctionId) return;
      // 재개
      setIsGenerating(true);
      setStartFromLast(true);
      (async () => {
        try {
          await waitUntilGenerated(correctionId);
          await waitUntilDetailReadable(correctionId);
          try {
            sessionStorage.removeItem('correctionGenerating');
          } catch {}
          const query = submissionTarget
            ? `?submissionTarget=${encodeURIComponent(submissionTarget)}`
            : '';
          router.push(`/myPage/tailoredPortfolio/${correctionId}${query}`);
        } catch (e) {
          console.warn('[UI][GENERATE][RESUME] failed while waiting after resume', e);
          setIsGenerating(false);
        }
      })();
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionId]);
  return (
    <div
      className="ml-[320px]
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
              width={96}
              height={96}
              className="translate-y-[18px]
            max-lg:w-[70px] max-lg:h-[70px] max-lg:translate-y-[32px]"
            />

            <div className="relative">
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
                  onClick={() => setTimeout(() => setSelectedCount(readSelectedCount()), 0)}
                  onKeyUp={() => setTimeout(() => setSelectedCount(readSelectedCount()), 0)}
                >
                  <Projects />
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative ml-[850px] mt-[20px]
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
              className={`absolute top-[38px] ml-[50px] z-10 px-[40px] py-[4px] rounded-[6px] flex items-center gap-[8px] text-[18px] font-bold text-white
                max-lg:top-[32px] max-lg:ml-[40px] max-lg:px-[30px] ${
                  selectedCount > 0 ? 'bg-[#81D7D4] cursor-pointer' : 'bg-[#BAE5E4] opacity-60 '
                }`}
              disabled={selectedCount === 0}
            >
              <span className="relative block w-[32px] h-[32px]">
                <Image
                  src="/icons/CreditIconBackground.svg"
                  alt="크레딧 아이콘 배경"
                  width={32}
                  height={32}
                  className="absolute inset-0 w-[32px] h-[32px] pointer-events-none"
                  priority
                />
                <Image
                  src="/icons/CreditIcon.svg"
                  alt="크레딧 아이콘"
                  width={24}
                  height={24}
                  className="absolute inset-0 m-auto w-[24px] h-[24px] object-contain"
                />
              </span>
              <p>AI 지원 맞춤 포트폴리오 첨삭 시작</p>
            </button>
          </div>

          {isGenerating && (
            <CorrectionLoadingModal isOpen={true} startFromLast={startFromLast} payload={null} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectSelect() {
  return (
    <Suspense fallback={null}>
      <ProjectSelectContent />
    </Suspense>
  );
}
