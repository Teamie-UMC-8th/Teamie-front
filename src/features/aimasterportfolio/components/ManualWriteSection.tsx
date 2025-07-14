interface ManualWriteSectionProps {
  isOpen: boolean;
}

export default function ManualWriteSection({ isOpen }: ManualWriteSectionProps) {
  if (!isOpen) return null;

  return (
    <>
    <div className="absolute top-[402px] left-[214px] w-[1492px] h-[804px] rounded-[16px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)] p-[40px] flex flex-col gap-[32px]">
      {/* 상세 정보 */}
      <div className="absolute top-[40px] left-[36px] w-[63px] h-[25px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        상세 정보
      </div>
      <textarea
        className="absolute top-[36px] left-[127px] w-[1325px] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
      />

      <div className="absolute top-[230px] left-[32px] w-[63px] h-[25px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        담당 업무
      </div>
      <textarea
        className="absolute top-[226px] left-[127px] w-[1325px] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
      />

      <div className="absolute top-[420px] left-[32px] w-[63px] h-[25px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        주요 성과
      </div>
      <textarea
        className="absolute top-[416px] left-[127px] w-[1325px] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
      />

      <div className="absolute top-[610px] left-[32px] w-[63px] h-[25px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        배운 점
      </div>
      <textarea
        className="absolute top-[606px] left-[127px] w-[1325px] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
      />
</div>


      </>
  );
}
