'use client';

export default function Tailored() {
  return (
    <div className="flex">
      <div
        className="bg-[#F8F8F8] w-[465px] h-[192px] rounded-[8px] grid justify-center mr-[24px] cursor-pointer"
        style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
      >
        <div className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px]">
          <p className="absolute text-[18px] left-[12px]">프로젝트 명</p>
          <div className="absolute right-[8px] bg-[#BED9FB] w-[80px] h-[32px] rounded-[4px] flex items-center justify-center">
            <span>수업</span>
          </div>
        </div>

        <div className=" w-[439px] h-[96px]">
          <div className="flex mb-[12px]">
            <div className="text-[16px] text-[#898989] mr-[38px] ml-[12px]">기여도</div>
            <div className="text-[16px] text-black mr-[24px]">63%</div>
            <img src="icons/percent-bar.svg" alt="Percent Bar" />
          </div>
          <div className="flex mb-[12px]">
            <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px]">진행 기간</div>
            <div className="text-[16px] text-black ">25.04~25.06</div>
          </div>
          <div className="flex">
            <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px]">주요 업무</div>
            <div className="text-[16px] text-black ">자료조사</div>
          </div>
        </div>
      </div>
      <div
        className="bg-[#F8F8F8] w-[465px] h-[192px] rounded-[8px] grid justify-center cursor-pointer"
        style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
      >
        <div className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px]">
          <p className="absolute text-[18px] left-[12px]">프로젝트 명</p>
          <div className="absolute right-[8px] bg-[#F7DFC4] w-[80px] h-[32px] rounded-[4px] flex items-center justify-center">
            <span>대외활동</span>
          </div>
        </div>

        <div className=" w-[439px] h-[96px]">
          <div className="flex mb-[12px]">
            <div className="text-[16px] text-[#898989] mr-[38px] ml-[12px]">기여도</div>
            <div className="text-[16px] text-black mr-[24px]">63%</div>
            <img src="icons/percent-bar.svg" alt="Percent Bar" />
          </div>
          <div className="flex mb-[12px]">
            <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px]">진행 기간</div>
            <div className="text-[16px] text-black ">25.04~25.06</div>
          </div>
          <div className="flex">
            <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px]">주요 업무</div>
            <div className="text-[16px] text-black ">자료조사</div>
          </div>
        </div>
      </div>
    </div>
  );
}
