import { useState } from 'react';
import CorrectionStartButtonModal from './CorrectionStartModal';
import Image from 'next/image';

type CorrectionRequestStartButtonProps = {
  onStart: () => void;
  modalTitle?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
};

export default function CorrectionStartButton({
  onStart,
  modalTitle = '6 Credit을 사용하여',
  cancelText = '취소',
  confirmText = '의뢰',
  className = '',
}: CorrectionRequestStartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    onStart();
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={`${className} cursor-pointer `}>
        <Image
          src="/icons/CorrectionRequestStartButton.svg"
          alt="첨삭 의뢰 시작 버튼"
          width={308}
          height={48}
          className="mt-[14px] ml-[308px]"
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
