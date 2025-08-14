'use client';
import { useState, useEffect } from 'react';

interface MiniDatePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  onRangeChange?: (startDate: Date, endDate: Date) => void;
  initialRangeStart?: Date | undefined;
  initialRangeEnd?: Date | undefined;
}

export default function MiniDatePicker({
  selectedDate,
  onDateChange,
  onRangeChange,
  initialRangeStart,
  initialRangeEnd,
}: MiniDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | undefined>(initialRangeStart);
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(initialRangeEnd);

  // 초기 범위가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (initialRangeStart && initialRangeEnd) {
      setRangeStart(initialRangeStart);
      setRangeEnd(initialRangeEnd);
    }
  }, [initialRangeStart, initialRangeEnd]);

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
        isCurrentMonth: true,
      });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (onRangeChange) {
      // 범위 선택 모드
      if (!rangeStart) {
        // 첫 번째 날짜 선택
        setRangeStart(date);
        setRangeEnd(undefined);
        onDateChange(date); // 첫 번째 날짜도 전달
      } else if (!rangeEnd) {
        // 두 번째 날짜 선택
        if (date.getTime() === rangeStart.getTime()) {
          // 같은 날짜 클릭 시 범위 해제
          setRangeStart(undefined);
          setRangeEnd(undefined);
          onDateChange(date);
        } else {
          // 범위 설정
          const startDate = date < rangeStart ? date : rangeStart;
          const endDate = date < rangeStart ? rangeStart : date;
          setRangeStart(startDate);
          setRangeEnd(endDate);
          onRangeChange(startDate, endDate);
        }
      } else {
        // 새로운 범위 시작
        setRangeStart(date);
        setRangeEnd(undefined);
        onDateChange(date);
      }
    } else {
      // 단일 날짜 선택 모드
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      onDateChange(selectedDate);
    }
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

  // 날짜가 범위 내에 있는지 확인
  const isDateInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    const dateTime = date.getTime();
    const startTime = Math.min(rangeStart.getTime(), rangeEnd.getTime());
    const endTime = Math.max(rangeStart.getTime(), rangeEnd.getTime());
    return dateTime >= startTime && dateTime <= endTime;
  };

  // 날짜가 범위의 시작 또는 끝인지 확인
  const isRangeBoundary = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    const dateTime = date.getTime();
    return dateTime === rangeStart.getTime() || dateTime === rangeEnd.getTime();
  };

  // 범위가 설정되었는지 확인
  const hasRange = rangeStart && rangeEnd;

  // 범위의 시작일과 종료일을 정렬하여 반환
  const getSortedRange = () => {
    if (!rangeStart || !rangeEnd) return { start: null, end: null };
    if (rangeStart <= rangeEnd) {
      return { start: rangeStart, end: rangeEnd };
    } else {
      return { start: rangeEnd, end: rangeStart };
    }
  };

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
                hasRange && isDateInRange(day.date)
                  ? 'bg-[#81D7D4] text-black'
                  : hasRange && isRangeBoundary(day.date)
                    ? 'bg-[#4A9C99] text-white font-bold'
                    : day.date.toDateString() === effectiveSelectedDate.toDateString()
                      ? 'bg-[#81D7D4] text-black'
                      : 'cursor-pointer hover:bg-gray-100'
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
