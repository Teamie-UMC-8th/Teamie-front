import Portal from '@/components/Portal';

interface ChangeLeaderModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChangeLeaderModal({ onClose, onConfirm }: ChangeLeaderModalProps) {
  return (
    <Portal>
      <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-[460px] h-[236px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[12px] px-[32px] py-[60px] relative">
          <button
            className="absolute top-[8px] right-[8px] w-[24px] h-[24px] cursor-pointer"
            onClick={onClose}
          >
            <img src="/icons/close.svg" alt="닫기" />
          </button>

          <h1 className="text-[20px] leading-[28px] font-semibold text-center text-black">
            이 팀원을 팀장으로 변경할까요?
          </h1>
          <h2 className="text-[14px] text-center text-[#898989] mb-[32px]">
            기존 팀장의 권한은 자동으로 해제됩니다.
          </h2>

          <div className="flex justify-center gap-[28px]">
            <button
              onClick={onClose}
              className="w-[103px] h-[34px] border border-black rounded-[4px] text-[18px] cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="w-[103px] h-[34px] border border-black rounded-[4px] text-[18px] cursor-pointer"
            >
              변경
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
