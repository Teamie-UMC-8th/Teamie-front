'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Image from 'next/image';

import 'react-calendar/dist/Calendar.css';

const DayPicker = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => setShowCalendar((prev) => !prev);

  return (
    <div className="relative inline-block font-pretendard">
      {/* dayPicker.svg 버튼 */}
      <button onClick={toggleCalendar} className="focus:outline-none">
        <Image
          src="/icons/dayPicker.svg"
          alt="날짜 선택"
          width={32}
          height={32}
          className="cursor-pointer"
        />
      </button>

      {/* 캘린더 표시 */}
      {showCalendar && (
        <div className="absolute z-10 mt-2 w-[368px]">
          <div className="h-[342px] max-w-sm p-4 rounded-xl shadow-md bg-white">
            <Calendar
              onChange={setValue}
              value={value}
              prev2Label={null}
              next2Label={null}
              locale="en-US"
              navigationLabel={({ label }) => <span className="font-bold text-lg">{label}</span>}
              formatShortWeekday={(locale, date) =>
                ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]
              }
              tileClassName={({ date, view, activeStartDate }) => {
                if (view !== 'month') return '';
                const now = new Date();
                const isToday =
                  date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear();
                const isSunday = date.getDay() === 0;
                const isSaturday = date.getDay() === 6;
                const isCurrentMonth = date.getMonth() === activeStartDate.getMonth();

                return [
                  isToday && 'bg-cyan-100 font-bold text-black rounded-full',
                  !isCurrentMonth && 'text-gray-400',
                  isCurrentMonth && isSunday ? 'text-red-500' : isCurrentMonth && 'text-black',
                  isCurrentMonth && isSaturday && 'text-black',
                ]
                  .filter(Boolean)
                  .join(' ');
              }}
              formatDay={(_, date) => String(date.getDate())}
            />
          </div>
        </div>
      )}

      {/* 캘린더 스타일 오버라이드 */}
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
