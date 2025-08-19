import { useState } from 'react';
import CorrectionStartButtonModal from './CorrectionStartModal';
import Image from 'next/image';

type CorrectionRequestStartButtonProps = {
  onStart: () => void;
  modalTitle?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  disabled?: boolean;
};

export default function CorrectionStartButton({
  onStart,
  modalTitle = '500 Credit을 사용하여',
  cancelText = '취소',
  confirmText = '의뢰',
  className = '',
  disabled = false,
}: CorrectionRequestStartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    onStart();
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => !disabled && setIsModalOpen(true)}
        disabled={disabled}
        className={`${className} mt-[14px] ml-[254px] px-[40px] py-[4px] bg-[#81D7D4] rounded-[6px] flex items-center gap-[8px] text-[18px] font-bold text-white  ${
          disabled ? 'opacity-50' : 'cursor-pointer'
        }`}
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
        <p>AI 지원 맞춤 포트폴리오 첨삭 의뢰하기</p>
      </button>

      {isModalOpen && (
        <CorrectionStartButtonModal
          title={modalTitle}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={handleStart}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
