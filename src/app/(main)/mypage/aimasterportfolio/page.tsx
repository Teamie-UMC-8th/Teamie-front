"use client";

import { SetStateAction, useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function ProjectMasterPortfolioPage() {
  const options = [
    { label: "수업", color: "#BED9FB" },
    { label: "동아리", color: "#CDE3C9" },
    { label: "대외활동", color: "#F7DFC4" },
    { label: "프로젝트", color: "#FBD5D5" },
    { label: "기타", color: "#C8C8C8" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [historyList, setHistoryList] = useState<
  { date: string; time: string; isOpen: boolean }[]>([]);  //객체 타입으로 변환, 시간, 날짜 저장하기 위함
  const [hasHistory, setHasHistory] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (option: SetStateAction<{ label: string; color: string }>) => { // 이 함수에서 날짜 시간 저장
    setSelected(option);
    setIsOpen(false);
  };

const handleGenerate = () => {
  const now = new Date();

  const date = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replaceAll(". ", ".").replace(".", ".");

  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

   if (!hasHistory) setHasHistory(true);

  setHistoryList((prev) => [
    ...prev,
    { date, time, isOpen: false },
  ]);
};

const toggleHistory = (index: number) => {
  setHistoryList((prev) =>
    prev.map((item, i) =>
      i === index ? { ...item, isOpen: !item.isOpen } : item
    )
  );
};


  return (
    <div className="relative w-full min-h-screen pb-[1000px]">
      {/* ← 아이콘 */}
      <ChevronLeft className="absolute top-[121px] left-[120px] w-[28px] h-[28px] text-[#000000]" />

      {/* 텍스트 */}
      <h2 className="absolute top-[120px] left-[168px] w-[111px] h-[29px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] text-[#000000] whitespace-nowrap">
        프로젝트 A
      </h2>

      {/* 구분선 */}
      <hr className="absolute top-[165px] left-[160px] w-[1600px] border-t-[2px] border-[#E7E7E7]" />

      {/* 버튼 박스 */}
      <div>
        <button className="absolute top-[117px] left-[1425px] flex gap-[10px] bg-[#81D7D4] rounded-[4px] px-[12px] py-[4px] font-[Pretendard] font-bold text-[18px] leading-[26px] text-white text-center items-center justify-center whitespace-nowrap h-[34px]">
          개인 회고로 이동
        </button>

        <button className="absolute top-[117px] left-[1587px] flex gap-[10px] bg-[#81D7D4] rounded-[4px] px-[12px] py-[4px] font-[Pretendard] font-bold text-[18px] leading-[26px] text-white text-center items-center justify-center whitespace-nowrap h-[34px]">
          프로젝트 홈으로 이동
        </button>
      </div>

      {/* 진행 기간, 분류 선택 */}
      <div className="absolute top-[233px] left-[200px] flex items-center gap-[28px]">
        {/* 진행 기간 라벨 */}
        <div className="w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
          진행 기간
        </div>

        {/* 날짜 텍스트 */}
        <div className="w-[230px] h-[30px] flex items-center justify-center font-[Pretendard] font-normal text-[20px] leading-[30px] text-[#000000] text-center whitespace-nowrap">
          2025.04.02 ~ 2025.06.20
        </div>

        {/* 분류 드롭다운 */}
        <div className="flex items-center rounded-[4px] p-[6px] w-fit gap-[10px]">
          {/* 분류 라벨 */}
          <div className="top-[233px] left-[717px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
            분류
          </div>


{/* 드롭다운 버튼 */}
<div className="relative flex items-center gap-[6px] cursor-pointer" onClick={toggleDropdown}>
  <div
    className="w-[80px] h-[32px] rounded-[4px] px-[12px] py-[4px] text-black font-[Pretendard] text-[18px] leading-[26px] flex items-center justify-center whitespace-nowrap"
    style={{ backgroundColor: selected.color }}
  >
    {selected.label}
  </div>

  {/* ▼ 아이콘 */}
  <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
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
      </div>

      {/* 기여도 + 퍼센트 바 + 퍼센트 수치 */}
      <div className="absolute top-[310px] left-[200px] flex items-center gap-[28px]">
        {/* 기여도 라벨 */}
        <div className="w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
          기여도
        </div>

        {/* 퍼센트 바 + 수치 */}
        <div className="flex items-center gap-[10px]">
          <div className="w-[299px] h-[17px] bg-[#FFFFFF] border border-[#BBBBBB] rounded-[3px] overflow-hidden">
            <div className="h-full bg-[#81D7D4]" style={{ width: "74%" }}></div>
          </div>
          <span className="w-[42px] h-[28px] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-[28px] tracking-[0.04em] text-center">
            74%
          </span>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="absolute top-[387px] left-[200px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        상세 정보
      </div>

      {/* 상세 정보 입력창 */}
      <textarea
        className="absolute top-[387px] left-[327px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="프로젝트의 배경, 문제 정의, 목표 설정"
      />

      {/* 담당 업무 */}
      <div className="absolute top-[577px] left-[200px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        담당 업무
      </div>

      {/* 담당 업무 입력창 */}
      <textarea
        className="absolute top-[577px] left-[327px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="나의 역할과 업무, 프로젝트 과정에서의 어려웠던 점과 극복한 방법"
      />

      {/* 주요 성과 */}
      <div className="absolute top-[767px] left-[200px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        주요 성과
      </div>

      {/* 주요 성과 입력창 */}
      <textarea
        className="absolute top-[767px] left-[327px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[20px] font-normal leading-[30px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="정량적인 수치 기반 성과, 정성적인 성과 평가"
      />

      {/* 배운 점 */}
      <div className="absolute top-[957px] left-[200px] w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] text-center whitespace-nowrap">
        배운 점
      </div>

      {/* 배운점 입력창 */}
      <textarea
        className="absolute top-[957px] left-[327px] w-[1393px] h-[162px] bg-[#FFFFFF] border-[2px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[20px] font-normal leading-[30px] text-black placeholder:text-[#898989] p-4 resize-none"
        placeholder="내가 배운 점과 느낀 점, 앞으로 개선하고 싶은 점"
      />

      {/* 하단 버튼 */}
      <div
        className="absolute top-[1159px] left-[1432px] flex items-center gap-[20px] w-fit h-[38px] bg-[#81D7D4] rounded-[8px] px-[20px] py-[6px]"
      >
        <button
          onClick={handleGenerate}
          className="w-[186px] h-[26px] bg-transparent text-white text-center font-[Pretendard] font-bold text-[18px] leading-[26px]"
        >
          AI 마스터 포트폴리오 생성
        </button>

        <div className="flex items-center gap-[6px] w-[42px] h-[26px]">
          {/* 포인트 아이콘 */}
          <div className="w-[24px] h-[24px] bg-[#FFD86D] rounded-full flex items-center justify-center">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 0L8.17639 4.82361L13 6.5L8.17639 8.17639L6.5 13L4.82361 8.17639L0 6.5L4.82361 4.82361L6.5 0Z"
                fill="white"
              />
            </svg>
          </div>

          {/* 포인트 수 */}
          <span className="w-[12px] h-[26px] text-white text-center font-[Pretendard] font-bold text-[18px] leading-[26px]">
            6
          </span>
        </div>
      </div>

{hasHistory && (
  <div className="absolute top-[1294px] left-[168px] flex flex-col gap-[20px] w-[1600px]">
    {/* 제목 */}
    <h3 className="font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] text-[#000000] not-italic whitespace-nowrap">
      생성 이력
    </h3>

    {/* 구분선 */}
    <hr className="w-full border-t-[2px] border-[#E7E7E7]" />

    {/* 이력 리스트 */}
    {historyList.map((item, index) => (
      <div
        key={index}
        className={index === historyList.length - 1 ? "mb-[40px]" : ""} 
      >
        {/* 날짜 줄 */}
        <div
          className="flex items-center gap-[12px] cursor-pointer"
          onClick={() => toggleHistory(index)}
        >
          {/* 화살표 */}
          <svg
            width="24"
            height="14"
            viewBox="0 0 24 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: item.isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
              marginTop: "2px",
            }}
          >
            <path
              d="M22.8286 2.93925L13.3917 12.9485C13.1731 13.1804 12.9381 13.3586 12.6867 13.4832C12.4352 13.6079 12.1591 13.6689 11.8583 13.6664C11.5574 13.6639 11.2813 13.6016 11.0298 13.4795C10.7784 13.3573 10.5434 13.1791 10.3248 12.9448L0.887955 2.93551C0.758699 2.79592 0.649421 2.63515 0.560117 2.45318C0.473163 2.27122 0.429687 2.07555 0.429687 1.86616C0.429687 1.44739 0.558942 1.0872 0.817454 0.785589C1.08067 0.483977 1.42496 0.33317 1.85033 0.33317L21.8627 0.333169C22.2904 0.333169 22.6347 0.487716 22.8955 0.796806C23.1564 1.1059 23.2868 1.46484 23.2868 1.87364C23.2868 1.97833 23.1341 2.33229 22.8286 2.93551"
              fill="black"
            />
          </svg>

          {/* 날짜 */}
          <span className="text-[20px] leading-[28px] tracking-[0.04em] font-[Pretendard] text-[#000000] font-normal">
            {item.date}
          </span>

          {/* 시간 */}
          <span className="text-[20px] leading-[28px] tracking-[0.04em] font-[Pretendard] text-[#000000] font-normal">
            {item.time}
          </span>
        </div>

        {item.isOpen && (
  <div className="mt-[32px] ml-[30px] flex flex-col gap-[32px]">
    {["상세정보", "담당 업무", "주요 성과", "배운 점"].map((label, idx) => (
      <div className="flex gap-[12px] items-start" key={idx}>
        {/* 라벨 */}
        <div className="w-[99px] h-[37px] px-[18px] py-[6px] bg-[#DAF3F3] rounded-[4px] 
                        font-[Pretendard] text-[18px] font-semibold leading-[25.2px] 
                        text-[#000000] text-center flex items-center justify-center whitespace-nowrap">
          {label}
        </div>

        {/* 읽기 전용 div (AI 생성 결과) */}
        <div className="w-[1373px] h-[162px] bg-white border-[2px] border-[#BBBBBB] rounded-[8px] 
                        p-4 overflow-y-auto text-[18px] leading-[26px] font-[Pretendard] 
                        text-[#898989] whitespace-pre-wrap">
          여기에 AI가 생성한 내용이 표시됩니다.
        </div>
      </div>
    ))}
  </div>
)}


      </div>
    ))}
  </div>
)}
    </div>
  );
}
