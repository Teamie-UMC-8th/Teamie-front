export default function ManualWriteSection() {
  return (
    <div className="w-[1492px] max-lg:w-[928px] h-auto rounded-[16px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)] px-[40px] max-lg:px-[28px] py-[40px] flex flex-col gap-[28px] max-lg:gap-[53px]">
      
      {/* 상세 정보 */}
      <div className="flex w-full max-lg:flex-col max-lg:gap-[8px]">
        <div className=" w-full lg:flex-[0.6] h-[25px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-black whitespace-nowrap max-lg:mt-[2px]">
          상세정보
        </div>
        <textarea
          className="w-full lg:flex-[9.4] h-[162px] min-h-[162px] max-h-[162px] appearance-none bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] max-lg:text-[16px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
          placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
        />
      </div>

      {/* 담당 업무 */}
      <div className="flex w-full max-lg:flex-col max-lg:gap-[8px]">
        <div className="w-full lg:flex-[0.6] h-[25px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-black whitespace-nowrap">
          담당 업무
        </div>
        <textarea
          className="w-full lg:flex-[9.4] h-[162px] min-h-[162px] max-h-[162px] appearance-none bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] max-lg:text-[16px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
          placeholder="나의 역할과 업무, 프로젝트 과정에서의 어려웠던 점과 극복한 방법"
        />
      </div>

      {/* 주요 성과 */}
      <div className="flex w-full max-lg:flex-col max-lg:gap-[8px]">
        <div className="w-full lg:flex-[0.6] h-[25px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-black whitespace-nowrap">
          주요 성과
        </div>
        <textarea
          className="w-full lg:flex-[9.4] h-[162px] min-h-[162px] max-h-[162px] appearance-none bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] max-lg:text-[16px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
          placeholder="정량적인 수치 기반 성과, 정성적인 성과 평가"
        />
      </div>

      {/* 배운 점 */}
      <div className="flex w-full max-lg:flex-col max-lg:gap-[8px]">
        <div className="w-full lg:flex-[0.6] h-[25px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-black whitespace-nowrap">
          배운 점
        </div>
        <textarea
          className="w-full lg:flex-[9.4] h-[162px] min-h-[162px] max-h-[162px] appearance-none bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] max-lg:text-[16px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
          placeholder="내가 배운 점과 느낀 점, 앞으로 개선하고 싶은 점"
        />
      </div>
    </div>
  );
} 