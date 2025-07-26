'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface AIConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AIConfirmModal({ onConfirm, onCancel }: AIConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-[460px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[12px] px-[32px] pt-[40px] pb-[40px]">
        <button
          className="absolute top-[8px] right-[8px] w-[24px] h-[24px] cursor-pointer"
          onClick={onCancel}
        >
          <img src="/icons/곱하기.svg" alt="닫기" className="w-[24px] h-[24px]" />
        </button>

        <div className="flex items-center justify-center gap-[6px] text-[16px] leading-[24px] font-semibold text-black text-center mb-[4px]">
          <Image src="/icons/coin.svg" alt="credit" width={24} height={24} />
          <span 
          className="text-[20px] font-semibold leading-[28px] text-black">6 Credit을 사용하여<br/>
          AI 마스터 포트폴리오를 생성하시겠습니까?
          </span>
        </div>

        <p className="text-[14px] leading-[22px] text-[#898989] text-center mb-[32px]">
          AI 마스터 포트폴리오는 프로젝트별로 한 번만 생성할 수 있어요.
        </p>

        {/* 버튼 그룹 */}
        <div className="flex justify-center gap-[28px]">
          <button
            onClick={onCancel}
            className="w-[103px] h-[34px] bg-[#FFFFFF] border border-[#000000] rounded-[4px] 
                     text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="w-[103px] h-[34px] bg-[#FFFFFF] border border-[#000000] rounded-[4px] 
                     text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] cursor-pointer"
          >
            생성
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
} 