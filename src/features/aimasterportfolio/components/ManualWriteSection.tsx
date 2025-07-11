interface ManualWriteSectionProps {
  isOpen: boolean;
}

export default function ManualWriteSection({ isOpen }: ManualWriteSectionProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 버튼 박스 */}
      <div>
        <button className="absolute top-[117px] left-[1425px] flex gap-[10px] bg-[#81D7D4] rounded-[4px] px-[12px] py-[4px] font-[Pretendard] font-bold text-[18px] leading-[26px] text-white text-center items-center justify-center whitespace-nowrap h-[34px]">
          개인 회고로 이동
        </button>
        <button className="absolute top-[117px] left-[1587px] flex gap-[10px] bg-[#81D7D4] rounded-[4px] px-[12px] py-[4px] font-[Pretendard] font-bold text-[18px] leading-[26px] text-white text-center items-center justify-center whitespace-nowrap h-[34px]">
          프로젝트 홈으로 이동
        </button>
      </div>

      {/* 상세 정보 */}
      <div className="absolute top-[388px] left-[214px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        상세 정보
      </div>
      <textarea
        className="absolute top-[388px] left-[341px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
      />

      {/* 담당 업무 */}
      <div className="absolute top-[578px] left-[214px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        담당 업무
      </div>
      <textarea
        className="absolute top-[578px] left-[341px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="나의 역할과 업무, 프로젝트 과정에서의 어려웠던 점과 극복한 방법"
      />

      {/* 주요 성과 */}
      <div className="absolute top-[768px] left-[214px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        주요 성과
      </div>
      <textarea
        className="absolute top-[768px] left-[341px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[20px] font-normal leading-[30px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="정량적인 수치 기반 성과, 정성적인 성과 평가"
      />

      {/* 배운 점 */}
      <div className="absolute top-[958px] left-[214px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        배운 점
      </div>
      <textarea
        className="absolute top-[958px] left-[341px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[20px] font-normal leading-[30px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="내가 배운 점과 느낀 점, 앞으로 개선하고 싶은 점"
      />
    </>
  );
}
