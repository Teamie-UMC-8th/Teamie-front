import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

type DeleteButtonModalProps = {
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteButtonModal({
  title,
  confirmText = '예',
  cancelText = '아니오',
  onConfirm,
  onCancel,
}: DeleteButtonModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-[460px] h-[214px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[12px] px-[32px] py-[60px]">
        <button
          className="absolute top-[8px] right-[8px] w-[24px] h-[24px] cursor-pointer"
          onClick={onCancel}
        >
          <img src="/icons/곱하기.svg" alt="닫기" />
        </button>

        <h3 className="text-[20px] leading-[28px] font-semibold text-center text-black mb-[32px]">
          {title}
        </h3>

        <div className="flex justify-center gap-[28px]">
          <button
            onClick={onCancel}
            className="w-[103px] h-[34px] border border-black rounded-[4px] text-[18px] cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-[103px] h-[34px] border border-black rounded-[4px] text-[18px] cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  if (mounted) {
    return createPortal(modalContent, document.body);
  }
  return null;
}
