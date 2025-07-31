'use client';

interface MeetingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  date: string;
  content: string;
}

export default function MeetingLogModal({
  isOpen,
  onClose,
  title,
  date,
  content,
}: MeetingLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-[970px] max-lg:[930px] h-[620px] max-lg:h-[605px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[16px]">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-[24px] max-lg:top-[16px] right-[24px] max-lg:right-[16px]"
          onClick={onClose}
        >
          <img src="/icons/곱하기.svg" alt="닫기" />
        </button>

        {/* 내부 내용 */}
        <div className="px-[60px] max-lg:px-[40px] py-[48px] max-lg:py-[41px]">
          <h2 className="text-[20px] font-bold leading-[28px] text-black mb-[8px]">
            {title}
          </h2>

          <hr className="w-full border-t border-[#BBBBBB] mb-[16px]" />

          <div className="flex items-center gap-[16px] mb-[16px]">
            <div className="text-[#898989] text-[16px] leading-[24px] tracking-[0.56px]">일자</div>
            <div className="text-[#000000] text-[16px] leading-[24px] tracking-[0.56px]">{date}</div>
          </div>

          <div className="rounded-[8px] border-[2px] border-[#E7E7E7] px-[60px] py-[12px] w-full h-[440px] overflow-y-auto text-[#000000] text-[16px] leading-[24px] tracking-[0.56px] whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
