'use client';

import Image from 'next/image';

interface AIConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  disableConfirm?: boolean;
  disableCancel?: boolean;
}

export default function AIConfirmModal({
  onConfirm,
  onCancel,
  confirmText = '생성',
  cancelText = '취소',
  isLoading = false,
  disableConfirm = false,
  disableCancel = false,
}: AIConfirmModalProps) {
  const confirmLabel = isLoading ? '생성 중…' : confirmText;

  // 로딩 중에도 확인 모달은 그대로 두고 버튼만 비활성화합니다.

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-[498px] h-[264px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[12px] px-[32px] pt-[60px] pb-[40px]">
        <button
          className="absolute top-[8px] right-[8px] w-[24px] h-[24px] cursor-pointer disabled:opacity-50"
          onClick={onCancel}
          disabled={disableCancel || isLoading}
        >
          <Image
            src="/icons/close.svg"
            alt="닫기"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </button>

        <div className="flex flex-col items-center justify-center text-center mb-[4px]">
          <div className="flex items-center gap-[6px]">
            <Image src="/icons/coin.svg" alt="credit" width={24} height={24} />
            <span className="text-[20px] font-semibold leading-[28px] text-black">
              {length * 10 + 100} Credit을 사용하여
            </span>
          </div>
          <span className="text-[20px] font-semibold leading-[28px] text-black mt-[4px]">
            AI 마스터 포트폴리오를 생성하시겠습니까?
          </span>
        </div>

        <p className="text-[14px] leading-[22px] text-[#898989] text-center mb-[32px]">
          AI 마스터 포트폴리오는 프로젝트별로 한 번만 생성할 수 있어요.
        </p>

        <div className="flex justify-center gap-[28px]">
          <button
            onClick={onCancel}
            className="w-[103px] h-[34px] bg-[#FFFFFF] border border-[#000000] rounded-[4px] text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] cursor-pointer disabled:opacity-50"
            disabled={disableCancel || isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-[103px] h-[34px] bg-[#FFFFFF] border border-[#000000] rounded-[4px] text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] cursor-pointer disabled:opacity-50"
            disabled={disableConfirm || isLoading}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
