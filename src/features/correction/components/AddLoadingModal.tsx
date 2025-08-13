'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  /** 돌아왔을 때 마지막 단계부터 보여줄지 여부 */
  startFromLast?: boolean;
}

interface LoadingStep {
  key: string;
  frames: string[];
  message: string;
  durationMs: number;
}

export default function LoadingModal({ isOpen, startFromLast = false }: LoadingModalProps) {
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
        message: '티미가 포트폴리오를 읽고고 있어요...',
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
    }
  }, [isOpen]);

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
