'use client';
import { useState } from 'react';

interface MiniDatePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
}

export default function MiniDatePicker({ selectedDate, onDateChange }: MiniDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // selectedDate가 없으면 오늘 날짜를 기본값으로 설정
  const effectiveSelectedDate = selectedDate || new Date();

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

  const handleDateSelect = (date: Date) => {
    // 선택된 날짜의 시작 시간(00:00:00) 또는 끝 시간(23:59:59) 설정
    const selectedDate = new Date(date);

    // 날짜만 사용하고 시간은 제거
    selectedDate.setHours(0, 0, 0, 0);

    onDateChange(selectedDate);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);

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
    <div className="w-[175px] h-[170px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-2 px-1">
        <button onClick={goToPreviousMonth} className="p-1 rounded text-black cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-[12px] font-semibold text-black">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button onClick={goToNextMonth} className="p-1 rounded text-black cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-3 text-[10px]">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} className="text-center text-[10px] text-black mb-1">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-x-4 gap-y-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateSelect(day.date)}
            className={`
              w-6 h-6 text-[12px] rounded-full flex items-center justify-center transition-colors
              ${!day.isCurrentMonth ? 'text-gray-400' : 'text-black'}
              ${day.isCurrentMonth && day.date.getDay() === 0 ? 'text-red-500' : ''}
                             ${
                               day.date.toDateString() === effectiveSelectedDate.toDateString()
                                 ? 'bg-[#81D7D4] text-black'
                                 : ' cursor-pointer hover:bg-gray-100'
                             }
            `}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
