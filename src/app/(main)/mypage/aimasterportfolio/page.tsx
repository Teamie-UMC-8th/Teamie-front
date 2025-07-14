"use client";

import { useState } from "react";
import ManualWriteSection from "@/features/aimasterportfolio/components/ManualWriteSection";
import AIGenerationSetion from "@/features/aimasterportfolio/components/AIGenerationSection";

export default function ProjectMasterPortfolioPage() {
  const options = [
    { label: "수업", color: "#BED9FB" },
    { label: "동아리", color: "#CDE3C9" },
    { label: "대외활동", color: "#F7DFC4" },
    { label: "프로젝트", color: "#FBD5D5" },
    { label: "기타", color: "#C8C8C8" },
  ];

  const [generationMethod, setGenerationMethod] = useState<"ai" | "manual">("manual");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (option: { label: string; color: string }) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full min-h-screen pb-[1000px]">
      {/* ← 아이콘 */}
      <img
        src="/icons/arrow-left.svg"
        alt="뒤로가기"
        className="absolute top-[121px] left-[120px] w-[28px] h-[28px]"
      />

      {/* 텍스트 */}
      <h2 className="absolute top-[120px] left-[168px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] text-[#000000] whitespace-nowrap">
        프로젝트 A
      </h2>

      {/* 구분선 */}
      <hr className="absolute top-[165px] left-[160px] w-[1600px] border-t-[2px] border-[#E7E7E7]" />

      {/* 탭 영역 */}
      <div className="absolute top-[350px] left-[230px] w-[1460px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] flex items-center justify-between">
        <p className="text-[20px] leading-[28px] font-semibold text-[#000000] font-[Pretendard]">
          마스터 포트폴리오
        </p>

        <div className="h-[42px] bg-[#F8F8F8] border border-[#E7E7E7] rounded-[4px] flex items-center px-[4px] py-[4px] gap-[2px]">
          <button
            onClick={() => setGenerationMethod("ai")}
            className={`px-[12px] py-[4px] rounded-[4px] flex items-center justify-center gap-[8px]
              font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all
              ${
                generationMethod === "ai"
                  ? "bg-[#81D7D4] text-white font-bold"
                  : "bg-[#F8F8F8] text-[#BBBBBB] font-normal hover:bg-[#81D7D4] hover:text-white hover:font-bold"
              }`}
          >
            <div className="w-[24px] h-[24px] bg-[#D9D9D9] flex items-center justify-center" />
            AI 생성
          </button>

          <button
            onClick={() => setGenerationMethod("manual")}
            className={`px-[12px] py-[4px] rounded-[4px] flex items-center justify-center gap-[8px]
              font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all
              ${
                generationMethod === "manual"
                  ? "bg-[#81D7D4] text-white font-bold"
                  : "bg-[#F8F8F8] text-[#BBBBBB] font-normal hover:bg-[#81D7D4] hover:text-white hover:font-bold"
              }`}
          >
            직접 작성
          </button>
        </div>
      </div>

      {/* 진행 기간 */}
      <div className="absolute top-[225px] left-[214px] flex items-center gap-[28px] min-w-[350px]">
        <div className="w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
          진행 기간
        </div>
        <div className="h-[30px] flex items-center justify-center font-[Pretendard] font-normal text-[20px] leading-[30px] text-[#000000] whitespace-nowrap">
          2025.04.02 ~ 2025.06.20
        </div>
      </div>

      {/* 분류 */}
      <div className="absolute top-[225px] left-[771px] flex items-center gap-[28px] min-w-[246px]">
        <div className="w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
          분류
        </div>
        <div className="relative flex items-center gap-[20px] cursor-pointer" onClick={toggleDropdown}>
          <div
            className="w-[80px] h-[32px] rounded-[4px] px-[12px] py-[4px] text-black font-[Pretendard] text-[18px] leading-[26px] flex items-center justify-center whitespace-nowrap"
            style={{ backgroundColor: selected.color }}
          >
            {selected.label}
          </div>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.4393 1.56365L7.77721 7.56922C7.64608 7.70832 7.50507 7.81525 7.35419 7.89003C7.20331 7.96481 7.03763 8.00145 6.85714 7.99996C6.67666 7.99846 6.51097 7.96107 6.3601 7.88779C6.20922 7.8145 6.06821 7.70757 5.93708 7.56698L0.274961 1.5614C0.197407 1.47765 0.13184 1.38119 0.0782577 1.27201C0.0260853 1.16283 -3.03994e-07 1.04542 -3.09486e-07 0.919795C-3.20469e-07 0.668534 0.0775525 0.452419 0.23266 0.271451C0.390587 0.0904841 0.597162 -2.61028e-08 0.852384 -3.72589e-08L12.8598 -5.62119e-07C13.1164 -5.73337e-07 13.323 0.0927276 13.4795 0.278182C13.636 0.463636 13.7143 0.679003 13.7143 0.924281C13.7143 0.987096 13.6226 1.19947 13.4393 1.5614"
              fill="black"
            />
          </svg>
          {isOpen && (
            <div className="absolute top-[40px] left-0 z-10 bg-white border border-dashed border-[#B085E3] rounded-[8px] px-[12px] py-[10px] flex flex-col gap-[8px] w-[90px]">
              {options.map((option) => (
                <div
                  key={option.label}
                  className="w-full h-[36px] rounded-[6px] flex items-center justify-center cursor-pointer font-[Pretendard] text-[16px] text-black"
                  style={{ backgroundColor: option.color }}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 기여도 */}
      <div className="absolute top-[225px] left-[1217px] flex items-center gap-[28px] min-w-[360px]">
        <div className="w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
          기여도
        </div>
        <div className="flex items-center gap-[21px]">
          <div className="w-[299px] h-[20px] bg-[#FFFFFF] border border-[#BBBBBB] rounded-[3px] overflow-hidden">
            <div className="h-full bg-[#81D7D4]" style={{ width: "74%" }}></div>
          </div>
          <span className="w-[42px] h-[28px] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-[28px] tracking-[0.04em] text-center">
            74%
          </span>
        </div>
      </div>

      {/* 직접 작성 & AI 생성 섹션 */}
      <ManualWriteSection isOpen={generationMethod === "manual"} />
      <AIGenerationSetion isOpen={generationMethod === "ai"} />
    </div>
  );
}
