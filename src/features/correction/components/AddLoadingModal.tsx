'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCorrection } from '@/hooks/mutations/useCreateCorrection';
import {
  fetchCompanyInsight,
  fetchCorrectionDetail,
  fetchRagData,
  startRag,
} from '@/services/correction/correction';
import { CreateCorrectionRequest } from '@/types/api/correction';

interface LoadingModalProps {
  isOpen: boolean;
  /** 돌아왔을 때 마지막 단계부터 보여줄지 여부 */
  startFromLast?: boolean;
  /** 생성 시작에 필요한 페이로드. 열릴 때 이 값이 있어야 프로세스를 시작합니다 */
  payload?: CreateCorrectionRequest | null;
}

interface LoadingStep {
  key: string;
  frames: string[];
  message: string;
  durationMs: number;
}

export default function LoadingModal({
  isOpen,
  startFromLast = false,
  payload,
}: LoadingModalProps) {
  const router = useRouter();
  const createCorrection = useCreateCorrection();
  const steps: LoadingStep[] = useMemo(
    () => [
      {
        key: 'information',
        frames: ['/icons/information1.svg', '/icons/information2.svg'],
        message: '티미가 지원 정보를 파악하고 있어요...',
        durationMs: 10_000,
      },

      {
        key: 'collect',
        frames: ['/icons/dataCollection1.svg', '/icons/dataCollection2.svg'],
        message: '티미가 데이터를 수집하고 있어요...',
        durationMs: 10_000,
      },
      {
        key: 'read',
        frames: ['/icons/read1.svg', '/icons/read2.svg'],
        message: '티미가 포트폴리오를 읽고 있어요...',
        durationMs: 15_000,
      },
      {
        key: 'write',
        frames: ['/icons/writing1.svg', '/icons/writing2.svg'],
        message: '티미가 첨삭 내용을 작성 중이에요...',
        durationMs: 20_000,
      },
      {
        key: 'review',
        frames: ['/icons/review1.svg', '/icons/review2.svg'],
        message: '티미가 검토 중이에요...',
        durationMs: 15_000,
      },
      {
        key: 'last',
        frames: ['/icons/last1.svg', '/icons/last2.svg'],
        message: '거의 다 됐어요...!',
        durationMs: Number.POSITIVE_INFINITY,
      },
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  const stepTimerRef = useRef<number | null>(null);
  const frameTimerRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const pollingStopRef = useRef(false);

  const waitForRagReady = async (
    correctionId: number,
    options: { minWaitMs?: number; maxWaitMs?: number; minStableCount?: number } = {}
  ): Promise<{
    rag: Awaited<ReturnType<typeof fetchRagData>>;
    insight: Awaited<ReturnType<typeof fetchCompanyInsight>>;
  }> => {
    const delayMs = 2000;
    const minWaitMs = options.minWaitMs ?? 15000; // 최소 대기 시간 보장
    const maxWaitMs = options.maxWaitMs ?? 120000; // 최대 2분
    const minStableCount = options.minStableCount ?? 3; // 연속 안정 횟수
    let consecutiveReady = 0;
    let attempt = 0;
    const startAt = Date.now();
    while (true) {
      attempt += 1;
      if (pollingStopRef.current) {
        throw new Error('Polling stopped');
      }
      try {
        const [rag, insight] = await Promise.all([
          fetchRagData(correctionId),
          fetchCompanyInsight(correctionId),
        ]);
        const hasKeywords = Array.isArray(rag?.keywords) && rag.keywords.length > 0;
        const hasLinks = Array.isArray(rag?.links) && rag.links.length > 0;
        const hasInsight =
          typeof insight?.companyInsight === 'string' && insight.companyInsight.trim().length > 0;
        const ready = hasKeywords && hasLinks && hasInsight;
        console.log(
          `[LoadingModal] RAG polling ${attempt} -> keywords:${hasKeywords} links:${hasLinks} insight:${hasInsight} ready:${ready} (consec=${consecutiveReady})`
        );
        if (ready) {
          consecutiveReady += 1;
          const elapsed = Date.now() - startAt;
          if (consecutiveReady >= minStableCount && elapsed >= minWaitMs) {
            return { rag, insight };
          }
        } else {
          consecutiveReady = 0;
        }
      } catch {
        consecutiveReady = 0;
      }
      if (Date.now() - startAt > maxWaitMs) {
        throw new Error('RAG readiness timeout');
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  };

  // 단계 진행 타이머
  useEffect(() => {
    if (!isOpen) return;

    const currentStep = steps[stepIndex];
    if (!currentStep) return;

    if (currentStep.durationMs !== Number.POSITIVE_INFINITY) {
      stepTimerRef.current = window.setTimeout(() => {
        setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      }, currentStep.durationMs);
    }

    return () => {
      if (stepTimerRef.current) {
        window.clearTimeout(stepTimerRef.current);
      }
    };
  }, [isOpen, stepIndex, steps]);

  // 재진입 시 마지막 단계로 점프 (옵션이 true일 때만)
  useEffect(() => {
    if (!isOpen) return;
    if (!startFromLast) {
      // 첫 진입(또는 옵션 false)에는 항상 첫 단계부터 시작
      setStepIndex(0);
      setFrameIndex(0);
      return;
    }
    setStepIndex(steps.length - 1);
    setFrameIndex(0);
  }, [isOpen, startFromLast, steps.length]);

  // 프레임(간단한 깜빡임) 애니메이션
  useEffect(() => {
    if (!isOpen) return;

    const currentStep = steps[stepIndex];
    const hasAnimation = currentStep.frames.length > 1;

    if (hasAnimation) {
      frameTimerRef.current = window.setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % currentStep.frames.length);
      }, 700);
    } else {
      setFrameIndex(0);
    }

    return () => {
      if (frameTimerRef.current) {
        window.clearInterval(frameTimerRef.current);
      }
    };
  }, [isOpen, stepIndex, steps]);

  // 모달이 닫힐 때 타이머 정리 및 초기화
  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setFrameIndex(0);
      if (stepTimerRef.current) window.clearTimeout(stepTimerRef.current);
      if (frameTimerRef.current) window.clearInterval(frameTimerRef.current);
      startedRef.current = false;
      pollingStopRef.current = true;
    } else {
      pollingStopRef.current = false;
    }
  }, [isOpen]);

  // 비즈니스 로직: 열리면 생성 -> RAG 준비 대기 -> 페이지 이동
  useEffect(() => {
    if (!isOpen) return;
    if (!payload) return;
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        // 새로운 생성 시작 전에 이전 prefetch/마지막 ID 흔적 제거
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < sessionStorage.length; i += 1) {
            const k = sessionStorage.key(i);
            if (!k) continue;
            if (k.startsWith('analyzingPrefetch:')) keysToRemove.push(k);
          }
          keysToRemove.forEach((k) => sessionStorage.removeItem(k));
          sessionStorage.removeItem('lastCorrectionId');
        } catch {}

        console.log('[LoadingModal] start create correction with payload:', payload);
        const created = await createCorrection.mutateAsync(payload);
        console.log('[LoadingModal] created correction id:', created.id);
        try {
          sessionStorage.setItem('lastCorrectionId', String(created.id));
        } catch {}
        // 생성 직후 RAG를 명시적으로 시작하여 POST를 보장
        try {
          console.log('[LoadingModal] start RAG explicitly for id:', created.id);
          await startRag(created.id);
          console.log('[LoadingModal] RAG started');
        } catch (e) {
          console.warn('[LoadingModal] startRAG POST failed (will proceed to poll):', e);
        }
        console.log('[LoadingModal] begin polling until RAG ready');
        const { rag, insight } = await waitForRagReady(created.id, {
          minWaitMs: 15000,
          minStableCount: 3,
        });
        console.log(
          '[LoadingModal] RAG ready. keywords:',
          rag.keywords?.length,
          'links:',
          rag.links?.length,
          'insight length:',
          (insight.companyInsight || '').length
        );
        // 준비 완료 후 즉시 상세 조회하여 prefetch 데이터 저장 (rag/insight는 위에서 확보)
        const detail = await fetchCorrectionDetail(created.id).catch((e) => {
          console.warn('[LoadingModal] prefetch: correction detail failed', e);
          return null as unknown as Awaited<ReturnType<typeof fetchCorrectionDetail>>;
        });
        const prefetch = {
          id: created.id,
          timestamp: Date.now(),
          detail,
          rag,
          insight,
        } as const;
        try {
          sessionStorage.setItem(`analyzingPrefetch:${created.id}`, JSON.stringify(prefetch));
        } catch (e) {
          console.warn('[LoadingModal] failed to write prefetch to sessionStorage', e);
        }
        router.push(
          `/mypage/addcorrection/analyzing?correctionId=${created.id}&submissionTarget=${encodeURIComponent(
            payload.submissionTarget
          )}`
        );
      } catch (error) {
        console.error('[LoadingModal] failed during creation or RAG wait:', error);
        alert('첨삭 생성에 실패했습니다. 다시 시도해주세요.');
      }
    };

    void run();
  }, [isOpen, payload, createCorrection, router]);

  if (!isOpen) return null;

  const current = steps[stepIndex];
  const currentFrame = current.frames[Math.min(frameIndex, current.frames.length - 1)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-[524px] h-[248px] bg-[#FFFFFF] shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[16px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center px-[32px] text-center">
          <Image src={currentFrame} alt="loading" width={140} height={140} priority />
          <p className="font-semibold text-[20px] leading-[28px] text-[#000000]">
            {current.message}
          </p>
        </div>
      </div>
    </div>
  );
}
