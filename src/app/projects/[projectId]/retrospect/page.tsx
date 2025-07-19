"use client";

import { useState } from "react";
import PersonalSection from "@/features/retrospects/components/PersonalSection";

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
      <div className="w-fit h-[42px] bg-[#F8F8F8] border border-[#E7E7E7] rounded-[4px] flex items-center px-[4px] py-[4px] gap-[10px] mb-[40px]"> {/*버튼이랑 회색박스 간격 조정*/}
        <button
          onClick={() => setSelectedTab("team")}
          className={`px-[12px] py-[4px] rounded-[4px]
                      flex items-center justify-center
                      font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all
                      ${
                        selectedTab === "team"
                          ? "bg-[#81D7D4] text-white font-bold"
                          : "bg-[#F8F8F8] text-[#BBBBBB] font-normal hover:bg-[#81D7D4] hover:text-white hover:font-bold"
                      }`}
        >
          팀 회고
        </button>

        <button
          onClick={() => setSelectedTab("personal")}
          className={`px-[12px] py-[4px] rounded-[4px]
                      flex items-center justify-center
                      font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all
                      ${
                        selectedTab === "personal"
                          ? "bg-[#81D7D4] text-white font-bold"
                          : "bg-[#F8F8F8] text-[#BBBBBB] font-normal hover:bg-[#81D7D4] hover:text-white hover:font-bold"
                      }`}
        >
          개인 회고
        </button>
      </div>

      {/* 개인 회고 섹션 렌더링 */}
      {selectedTab === "personal" && <PersonalSection />}
    </div>
  );
}
