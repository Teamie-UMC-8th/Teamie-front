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
        className={`${className} inline-block mt-[14px] ml-[338px] p-0 border-0 bg-transparent ${
          disabled ? 'opacity-50' : 'cursor-pointer'
        }`}
      >
        <Image
          src="/icons/CorrectionRequestStartButton.svg"
          alt="첨삭 의뢰 시작 버튼"
          width={308}
          height={48}
          className="block"
        />
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
