'use client';
import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  isOpen,
  onToggle,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    // 이전 달의 마지막 날들 (첫 주를 완성하기 위해)
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // 현재 달의 날들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // 현재 달의 실제 주 수 계산
    const totalDaysIncludingPrev = firstDayOfWeek + daysInMonth;
    const totalWeeks = Math.ceil(totalDaysIncludingPrev / 7);

    // 필요한 총 날짜 수 계산 (5주 또는 6주)
    const totalDaysNeeded = totalWeeks * 7;

    // 다음 달의 날들로 완성
    const remainingDays = totalDaysNeeded - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // const formatDate = (date: Date) => {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   return `${year}.${month}.${day}`;
  // };

  const handleDateSelect = (date: Date) => {
    // 한국 시간 기준으로 23:59 설정
    const selectedDate = new Date(date);
    // 로컬 시간대 기준으로 23:59 설정
    selectedDate.setHours(23, 59, 0, 0);
    onDateChange(selectedDate);
    onToggle();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);

  // 현재 달의 주 수 계산
  const totalWeeks = Math.ceil(days.length / 7);
  const containerHeight = totalWeeks === 5 ? 'h-[342px]' : 'h-[386px]';

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div
          className={`absolute mt-8 left-[-32px] bg-white rounded-lg z-50 w-[368px] ${containerHeight}`}
          style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between py-[16px] px-[20px] ">
            <button onClick={goToPreviousMonth} className="p-1 rounded text-black cursor-pointer">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-[18px] font-semibold text-black">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button onClick={goToNextMonth} className="p-1 rounded text-black cursor-pointer">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 px-[20px] gap-[14px]">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <div key={day} className="text-center text-[16px] text-black mb-[12px]">
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 px-[20px] gap-[14px]">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day.date)}
                className={`
                  w-8 h-8 text-[18px] rounded-full flex items-center justify-center transition-colors
                  ${!day.isCurrentMonth ? 'text-gray-400' : 'text-black'}
                  ${day.isCurrentMonth && day.date.getDay() === 0 ? 'text-red-500' : ''}
                  ${
                    selectedDate &&
                    day.date.getDate() === selectedDate.getDate() &&
                    day.date.getMonth() === selectedDate.getMonth() &&
                    day.date.getFullYear() === selectedDate.getFullYear()
                      ? 'bg-[#BAEBEB] text-black'
                      : ' cursor-pointer'
                  }
                `}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
