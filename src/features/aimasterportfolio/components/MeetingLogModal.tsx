'use client';

import Image from 'next/image';
interface MeetingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  date: string;
  content: string;
  onSelect?: () => void; // 선택하기/시작하기 버튼 클릭 시 동작
}

export default function MeetingLogModal({
  isOpen,
  onClose,
  title,
  date,
  content,
  onSelect,
}: MeetingLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-[970px] max-lg:[930px] h-[666px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[16px]">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-[24px] max-lg:top-[16px] right-[24px] max-lg:right-[16px] cursor-pointer"
          onClick={onClose}
        >
          <Image src="/icons/곱하기.svg" alt="닫기" width={24} height={24} />
        </button>

        {/* 내부 내용 */}
        <div className="px-[60px] max-lg:px-[40px] py-[48px] max-lg:py-[41px]">
          <h2 className="text-[20px] font-bold leading-[28px] text-black mb-[8px]">{title}</h2>

          <hr className="w-full border-t border-[#BBBBBB] mb-[16px]" />

          <div className="flex items-center gap-[16px] mb-[16px]">
            <div className="text-[#898989] text-[16px] leading-[24px] tracking-[0.56px]">일자</div>
            <div className="text-[#000000] text-[16px] leading-[24px] tracking-[0.56px]">
              {date}
            </div>
          </div>

          <div className="rounded-[8px] border-[2px] border-[#E7E7E7] px-[20px] py-[16px] w-full h-[440px] overflow-y-auto text-[#000000] text-[16px] leading-[24px] tracking-[0.56px] whitespace-pre-wrap">
            {content}
          </div>

          {/* 하단 시작하기/선택하기 버튼 */}
          <div className="w-full flex justify-end mt-[24px]">
            <button
              type="button"
              onClick={onSelect}
              className="w-[127px] h-[38px] px-[32px] rounded-[6px] font-bold border border-[#81D7D4] bg-[#81D7D4] text-[#FFFFFF] text-[18px] leading-[24px] tracking-[0.56px] cursor-pointer whitespace-nowrap flex items-center justify-center"
            >
              선택하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
