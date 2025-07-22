import { createPortal } from 'react-dom';
import { JSX, useEffect, useState } from 'react';
import Link from 'next/link';

type CorrectionStartButtonModalProps = {
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function CorrectionStartButtonModal({
  title,
  confirmText = '의뢰',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: CorrectionStartButtonModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="relative w-[498px] h-[266px] bg-[#F8F8F8] rounded-[12px] px-[124px] py-[60px]"
        style={{
          boxShadow: '0px 0px 15px 0px #00000033',
        }}
      >
        <button
          className="absolute top-[8px] right-[8px] w-[24px] h-[24px] cursor-pointer"
          onClick={onCancel}
        >
          <img src="/icons/곱하기.svg" alt="닫기" />
        </button>

        <div className="w-[251px] grid place-items-center">
          <div className="flex items-start">
            <img
              src="/icons/CorrectionModalIcon.svg"
              alt="첨삭 모달 아이콘"
              className="mt-[2px] mr-[12px]"
            />
            <h3 className="text-[20px] font-semibold text-center text-black">{title}</h3>
          </div>
          <p className="text-[20px] font-semibold text-center text-black mb-[28px]">
            AI 지원 맞춤 포트폴리오 첨삭을 의뢰하시겠습니까?
          </p>
        </div>

        <div className="flex justify-center gap-[28px]">
          <button
            onClick={onCancel}
            className="w-[103px] h-[34px] border border-black rounded-[4px] text-[18px] cursor-pointer"
          >
            {cancelText}
          </button>
          <Link href="/mypage/addcorrection/analyzing/">
            <button
              onClick={onConfirm}
              className="w-[103px] h-[34px] border border-black rounded-[4px] text-[18px] cursor-pointer"
            >
              {confirmText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  if (mounted) {
    return createPortal(modalContent, document.body);
  }
  return null;
}
