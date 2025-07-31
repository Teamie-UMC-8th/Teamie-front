"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarButton from "@/features/teamclendar/CalendarButton";
import CustomDateCellWrapper from "@/features/teamclendar/CustomDateCellWrapper";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "정기 회의",
    start: new Date(2025, 3, 30, 10, 0),
    end: new Date(2025, 3, 30, 11, 0),
  },
  {
    title: "업무 A 0차 마감",
    start: new Date(2025, 4, 1, 10, 0),
    end: new Date(2025, 4, 1, 11, 0),
  },
];

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1));

  const handlePrevMonth = () => {
    const newDate = moment(currentDate).subtract(1, "month").toDate();
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = moment(currentDate).add(1, "month").toDate();
    setCurrentDate(newDate);
  };

  const formattedTitle = moment(currentDate).format("YYYY년 M월");

  return (
    <div>
      {/* 제목 */}
      <div className="w-full lg:max-w-[1415px] flex flex-col">
        <h2 className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
        max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0]">
          팀 캘린더
        </h2>
        <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[44px]" />
      </div>

      {/* 월 네비게이션 */}
      <div className="flex justify-start items-center gap-3 font-semibold text-[20px] leading-[29px] text-black mb-[47px]">
        <button onClick={handlePrevMonth}>
          <img src="/icons/Vector-left.svg" alt="왼쪽으로 이동" className="w-[24px] h-[24px] cursor-pointer" />
        </button>
        <span>{formattedTitle}</span>
        <button onClick={handleNextMonth}>
          <img src="/icons/Vector-right.svg" alt="오른쪽으로 이동" className="w-[24px] h-[24px] cursor-pointer" />
        </button>
        <CalendarButton/>
      </div>

      {/* 캘린더 */}
      <BigCalendar
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH]}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={() => {}}
        style={{ height: "calc(100vh - 300px)", backgroundColor: "white" }}
        components={{dateCellWrapper: CustomDateCellWrapper,}}
        popup
        toolbar={false}
        eventPropGetter={(event) => {
          let backgroundColor = "#B6F5DF"; // 기본 색상

          if (event.title === "업무 A 0차 마감") {
            backgroundColor = "#DAF3F3"; // 연하늘색
          }

          return {
            style: {
              backgroundColor,
              borderRadius: "4px",
              padding: "4px 22px",
              color: "#000000",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              fontFamily: "Pretendard, sans-serif",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
            },
          };
        }}
      />
    </div>
  );
}
