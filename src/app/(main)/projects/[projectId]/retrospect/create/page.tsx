"use client";

import { useState } from "react";
import PersonalSection from "@/features/retrospects/components/PersonalSection";

export default function PersonalRetroPage() {
  const [selectedTab, setSelectedTab] = useState<"team" | "personal">("personal");

  return (
    <div className="w-full px-[128px] pt-[60px] max-lg:px-[32px]">
      <div className="w-full lg:max-w-[1415px] flex flex-col">
        {/* 제목 */}
        <h2 className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
        max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0] mb-[16px] whitespace-nowrap">
          개인 회고
        </h2>

        {/* 구분선 */}
        <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[20px]"  />

        {/* 탭 버튼 */}
        <div className="w-fit h-[42px] bg-[#F8F8F8] border border-[#E7E7E7] rounded-[4px] flex items-center px-[4px] py-[4px] mb-[40px]">
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

        {/* 개인 회고 섹션 */}
        {selectedTab === "personal" && <PersonalSection />}
      </div>
    </div>
  );
}
