'use client';

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import Daypicker from "@/components/DayPicker";
import Image from "next/image";
import SchdulePage from "./schedulePage";

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
    <div className="flex flex-col items-start min-h-screen py-10 w-full max-w-7xl mx-auto bg-white">
      {/* 화살표 + 월 표시 */}
      <h1 className="text-xl font-bold mb-2">팀 캘린더</h1>
      {/* 구분선 */}
<hr className="w-full border-t" style={{ borderColor: "#E7E7E7" }} />
      <div className="flex items-center mb-4 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="text-base px-1 hover:text-blue-600"
          >
            ◀
          </button>
          <h2 className="text-xl font-bold">
            {format(currentDate, "yyyy MMMM", { locale: enUS })}
          </h2>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="text-base px-2 hover:text-blue-600"
          >
            ▶
          </button>
        </div>
        <div className="flex-1 flex justify-end">
          <button className="ml-2 p-2 rounded hover:bg-gray-200">
            <Image
              src="/icons/hambergerMenu.svg"
              alt="메뉴"
              width={36}
              height={36}
            />
          </button>
        </div>
      </div>

      {/* 캘린더 */}
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
                <div
                  className={`text-center font-semibold text-[15px] ${
                    isSunday ? "text-red-500" : ""
                  }`}
                >
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
      <style jsx global>{`
        .rbc-month-row {
          border-bottom: 1px solid #BBBBBB !important;
        }
        .rbc-month-header {
          border-bottom: 1px solid #BBBBBB !important;
          padding-bottom: 12px !important;
        }
        .rbc-header {
          font-size: 18px !important;
          padding-top: 8px !important;
        }
      `}</style>

      
      {/* <SchdulePage /> */}
      
    </div>
  );
}
