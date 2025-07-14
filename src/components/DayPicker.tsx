"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 기본 스타일 (여전히 로드됨 - 오버라이드 가능)

const DayPicker = () => {
  const [value, setValue] = useState<Date>(new Date());

  return (
    <div className="w-[368px] h-[342px] max-w-sm mx-auto p-4 rounded-xl shadow-md bg-white font-pretendard">
      <Calendar
        onChange={setValue}
        value={value}
        prev2Label={null}
        next2Label={null}
        locale="en-US"
        // 월/년도 bold
        navigationLabel={({ date, label, locale }) => (
          <span className="font-bold text-lg">{label}</span>
        )}
        // 요일 헤더는 bold 해제 (font-normal)
        formatShortWeekday={(locale, date) =>
          ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]
        }
        tileClassName={({ date, view, activeStartDate }) => {
          if (view !== "month") return "";
          const now = new Date();
          const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
          const isSunday = date.getDay() === 0;
          const isSaturday = date.getDay() === 6;
          
          // 현재 보여지는 월과 다른 월의 날짜인지 확인
          const isCurrentMonth = date.getMonth() === activeStartDate.getMonth();
          
          return [
            isToday && "bg-cyan-100 font-bold text-black rounded-full",
            !isCurrentMonth && "text-gray-400", // 다른 월의 날짜는 회색으로
            isCurrentMonth && isSunday ? "text-red-500" : isCurrentMonth && "text-black",
            isCurrentMonth && isSaturday && "text-black", // 토요일을 명시적으로 검은색으로 설정
          ]
            .filter(Boolean)
            .join(" ");
        }}
        formatDay={(_, date) => String(date.getDate())}
      />
      <style jsx global>{`
        .react-calendar__month-view__weekdays__weekday {
          font-weight: 400 !important;
          border-bottom: none !important;
        }
        .react-calendar__month-view__weekdays {
          border-bottom: none !important;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
          border-bottom: none !important;
        }
        .react-calendar {
          border: 1px solid #fff !important;
          border-radius: 8px !important;
        }
        /* 색상 오버라이드 */
        .react-calendar__tile {
          color: black !important;
        }
        .react-calendar__tile.text-red-500 {
          color: #ef4444 !important;
        }
        .react-calendar__tile.text-gray-400 {
          color: #898989 !important;
        }
          .react-calendar__tile--now {
        background: #e0f7fa !important;
        color: black !important;
      }
        /* 이전/다음 월 버튼 크기 키우기 */
        .react-calendar__navigation__arrow {
          width: 40px !important;
          height: 40px !important;
          font-size: 40px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      `}</style>
    </div>
  );
};

export default DayPicker;