"use client";

import { ReactNode, useState } from "react";

export default function CustomDateCellWrapper({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative w-full h-full transition-all duration-200 rounded-[4px] ${
        hovered ? "shadow-[0_0_10px_rgba(0,0,0,0.25)]" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 날짜 셀 내용 */}
      {children}

      {/* 플러스 버튼 (hover 상태 유지되게 감싸줌) */}
      <div
        className="absolute top-[8px] right-[8px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && (
          <button
            className="flex items-center justify-center rounded-[4px]"
            onClick={() => alert("일정 추가")}
          >
            <img
              src="/icons/AddProject.svg"
              alt="일정 추가"
              className="w-[24px] h-[24px]"
            />
          </button>
        )}
      </div>
    </div>
  );
}
