export default function ManualWriteSection() {
  return (
    <>
      <div className="h-[804px] rounded-[16px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)] p-[40px] flex flex-col items-start gap-[32px]">
        <div className="flex w-full">
          <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
            상세 정보
          </div>
          <textarea
            className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
            placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
          />
        </div>

        <div className="flex w-full">
          <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
            담당 업무
          </div>
          <textarea
            className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
            placeholder="담당한 업무와 역할"
          />
        </div>

        <div className="flex w-full">
          <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
            주요 성과
          </div>
          <textarea
            className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
            placeholder="달성한 성과와 결과"
          />
        </div>

        <div className="flex w-full">
          <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
            배운 점
          </div>
          <textarea
            className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
            placeholder="프로젝트를 통해 배운 점"
          />
        </div>
      </div>
    </>
  );
}
