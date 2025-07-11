"use client";

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

const locales = { "en-US": enUS };

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
        <h2 className="text-2xl font-bold">
          {format(currentDate, "yyyy MMMM", { locale: enUS })}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="text-xl px-2 hover:text-blue-600"
        >
          ▶
        </button>
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
          views={["month"]}
          style={{ height: "60vh" }}
          components={{
            header: (props) => {
              const dayName = format(props.date, "eee", { locale: enUS });
              const isSunday = props.label === "Sun";
              return (
                <div
                  className={`text-center font-semibold ${
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
                    (props.value.getMonth() !== currentDate.getMonth()
                      ? "bg-white "
                      : "") + " text-left"
                  }
                >
                  {props.children}
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
}
