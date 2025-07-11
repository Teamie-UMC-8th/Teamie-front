"use client";

import { useState } from "react";

export default function PersonalRetroPage() {
  const [selectedTab, setSelectedTab] = useState<"team" | "personal">("personal");

  return (
    <div className="absolute top-[120px] left-[313px]">
      {/* 제목 */}
      <h2 className="w-[93px] h-[29px] mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000] not-italic">
        개인 회고
      </h2>

      {/* 구분선 */}
      <hr className="w-[1495px] border-t-[2px] border-[#E7E7E7] rotate-180 mb-[20px]" />

      {/* 버튼 */}
      <div className="w-fit h-[42px] bg-[#F8F8F8] border border-[#E7E7E7] rounded-[4px] flex items-center px-[4px] py-[4px] gap-[10px] mb-[40px]">
        <button
          onClick={() => setSelectedTab("team")}
          className={`px-[12px] py-[4px] rounded-[4px] flex items-center justify-center font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all ${
            selectedTab === "team"
              ? "bg-[#81D7D4] text-white font-bold"
              : "bg-[#F8F8F8] text-[#BBBBBB] font-normal hover:bg-[#81D7D4] hover:text-white hover:font-bold"
          }`}
        >
          팀 회고
        </button>

        <button
          onClick={() => setSelectedTab("personal")}
          className={`px-[12px] py-[4px] rounded-[4px] flex items-center justify-center font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all ${
            selectedTab === "personal"
              ? "bg-[#81D7D4] text-white font-bold"
              : "bg-[#F8F8F8] text-[#BBBBBB] font-normal hover:bg-[#81D7D4] hover:text-white hover:font-bold"
          }`}
        >
          개인 회고
        </button>
      </div>

      
      {selectedTab === "personal" && <PersonalSection />}  {/*조건부 렌더링*/} 
    </div>
  );
}


function PersonalSection() {
  return (
    <>
      {/* 섹션 1 */}
      <div className="w-[1490px] h-[612px] bg-[#F8F8F8] border-[2px] border-[#BBBBBB] rounded-[12px] px-[40px] pt-[32px] pb-[32px] mb-[40px]">
        <h2 className="font-[Pretendard] text-[#000000] font-bold text-[20px] leading-[28px] mb-[16px]">
          1. 나의 역할과 일하는 방식
        </h2>
        <ul className="list-disc list-outside pl-[40px] space-y-[8px] text-[#000000] font-[Pretendard] text-[18px] leading-[26px] font-normal marker:text-[11px] mb-[32px]">
          <li>내가 맡은 공식적 역할 외에, 자연스럽게 맡게 된 행동이나 역할이 있었나요?</li>
          <li>내가 주도하거나 적극적으로 기여한 순간은 언제였나요?</li>
          <li>협업에서 내가 특히 신경 쓴 점은 무엇인가요? (예: 일정 관리, 팀 분위기 등)</li>
          <li>이 프로젝트에서 나와 잘 맞았던 협업 및 소통 방식이나 흐름이 있었나요?</li>
        </ul>
        <textarea className="w-full h-[344px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[12px] p-[24px] text-[16px] text-[#000000] font-[Pretendard] resize-none" />
      </div>

      {/* 섹션 2 */}
      <div className="w-[1490px] h-[612px] bg-[#F8F8F8] border-[2px] border-[#BBBBBB] rounded-[12px] px-[40px] pt-[32px] pb-[32px] mb-[40px]">
        <h2 className="font-[Pretendard] text-[#000000] font-bold text-[20px] leading-[28px] mb-[16px]">
          2. 기억에 남는 경험과 변화
        </h2>
        <ul className="list-disc list-outside pl-[40px] space-y-[8px] text-[#000000] font-[Pretendard] text-[18px] leading-[26px] font-normal marker:text-[11px] mb-[32px]">
          <li>가장 어려웠던 점은 무엇이었고, 어떻게 극복했나요?</li>
          <li>협업 중 기억에 남는 갈등이나 돌발상황이 있었나요? 그 상황에서 나는 어떻게 행동했나요?</li>
          <li>내가 감정적으로 크게 동요했거나, 가치관을 자극받았던 순간은 언제였나요?</li>
          <li>이번 프로젝트를 통해 강화되었거나 달라진 나의 가치관이나 일하는 태도는 무엇인가요?</li>
        </ul>
        <textarea className="w-full h-[344px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[12px] p-[24px] text-[16px] text-[#000000] font-[Pretendard] resize-none" />
      </div>

      {/* 섹션 3 */}
      <div className="w-[1490px] h-[612px] bg-[#F8F8F8] border-[2px] border-[#BBBBBB] rounded-[12px] px-[40px] pt-[32px] pb-[32px] mb-[40px]">
        <h2 className="font-[Pretendard] text-[#000000] font-bold text-[20px] leading-[28px] mb-[16px]">
          3. 나의 강점과 성장 포인트
        </h2>
        <ul className="list-disc list-outside pl-[40px] space-y-[8px] text-[#000000] font-[Pretendard] text-[18px] leading-[26px] font-normal marker:text-[11px] mb-[32px]">
          <li>이 프로젝트를 통해 드러난 나의 강점은 무엇인가요?</li>
          <li>이 프로젝트를 통해 드러난 나의 개선이 필요한 부분은 어떤 점인가요?</li>
          <li>이 강점 또는 취약점을 인식하게 된 계기가 있었나요?</li>
          <li>다음 프로젝트에서 이 점을 어떻게 살리고, 보완하고 싶나요?</li>
        </ul>
        <textarea className="w-full h-[344px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[12px] p-[24px] text-[16px] text-[#000000] font-[Pretendard] resize-none" />
      </div>
    </>
  );
}
