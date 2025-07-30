<<<<<<< HEAD
'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import Daypicker from '@/components/DayPicker';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function TeamCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-gray-50">
      {/* 화살표 + 월 표시 */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="text-xl px-2 hover:text-blue-600"
        >
          ◀
        </button>
        <h2 className="text-2xl font-bold">{format(currentDate, 'yyyy MMMM', { locale: enUS })}</h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="text-xl px-2 hover:text-blue-600"
        >
          ▶
=======
"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
>>>>>>> 920ed2c (🎨 Design: 팀 캘린더 ui 구현)
        </button>
      </div>

      {/* 캘린더 */}
<<<<<<< HEAD
      <div className="w-full max-w-7xl bg-white rounded-lg shadow p-4">
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          toolbar={false}
          culture="en-US"
          views={['month']}
          style={{ height: '60vh' }}
          components={{
            header: (props) => {
              const dayName = format(props.date, 'eee', { locale: enUS });
              const isSunday = props.label === 'Sun';
              return (
                <div className={`text-center font-semibold ${isSunday ? 'text-red-500' : ''}`}>
                  {dayName}
                </div>
              );
            },
            dateCellWrapper: (props) => {
              return (
                <div
                  className={
                    (props.value.getMonth() !== currentDate.getMonth() ? 'bg-white ' : '') +
                    ' text-left'
                  }
                >
                  {props.children}
                </div>
              );
            },
          }}
        />
      </div>
      {/* Daypicker 컴포넌트 호출 */}
      <div className="w-full flex justify-center">
        <Daypicker />
      </div>
=======
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
>>>>>>> 920ed2c (🎨 Design: 팀 캘린더 ui 구현)
    </div>
  );
}
