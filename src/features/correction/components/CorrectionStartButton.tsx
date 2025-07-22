import { JSX, useState } from 'react';
import CorrectionStartButtonModal from './CorrectionStartModal';
import Link from 'next/link';

type CorrectionStartButtonProps = {
  onStart: () => void;
  modalTitle?: JSX.Element;
  confirmText?: string;
  cancelText?: string;
  className?: string;
};

export default function CorrectionStartButton({
  onStart,
  modalTitle = (
    <div className="flex items-center gap-[8px]">
      <img src="/icons/CorrectionModalIcon.svg" alt="첨삭 모달 아이콘" />
      <span>6 Credit을 사용하여 AI 지원 맞춤 포트폴리오 첨삭을 의뢰하시겠습니까?</span>
    </div>
  ),
  cancelText = '취소',
  confirmText = '의뢰',
  className = '',
}: CorrectionStartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    onStart();
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={`${className} cursor-pointer `}>
        <img
          src="/icons/CorrectionStartButton.svg"
          alt="첨삭 시작 버튼"
          className="mt-[14px] ml-[338px]"
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
