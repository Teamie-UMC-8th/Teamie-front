'use client';
import { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  selectedTime: { hour: number; minute: number; period: 'AM' | 'PM' };
  onTimeChange: (time: { hour: number; minute: number; period: 'AM' | 'PM' }) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function TimePicker({
  selectedTime,
  onTimeChange,
  isOpen,
  onToggle,
}: TimePickerProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeDropdowns, setActiveDropdowns] = useState<Set<'period' | 'hour' | 'minute'>>(
    new Set()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
        setActiveDropdowns(new Set());
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    onTimeChange({ ...selectedTime, period });
    setActiveDropdowns(new Set());
  };

  const handleHourChange = (hour: number) => {
    onTimeChange({ ...selectedTime, hour });
    setActiveDropdowns(new Set());
  };

  const handleMinuteChange = (minute: number) => {
    onTimeChange({ ...selectedTime, minute });
    setActiveDropdowns(new Set());
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <>
          {/* 초기 시간 선택 필드 */}
          <div
            className="absolute mt-8 left-[-32px] bg-white rounded-lg z-50 w-[260px] h-[48px]"
            style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
          >
            <div className="p-[8px]">
              <div className="flex items-center justify-center">
                {/* AM/PM Selector */}
                <button
                  onClick={() => {
                    const newDropdowns = new Set(activeDropdowns);
                    if (newDropdowns.has('period')) {
                      newDropdowns.delete('period');
                    } else {
                      newDropdowns.add('period');
                    }
                    setActiveDropdowns(newDropdowns);
                  }}
                  className={`w-[60px] h-[32px] text-[18px] border rounded-[4px] transition-colors mr-[12px] ${
                    activeDropdowns.has('period')
                      ? 'border-black bg-white'
                      : 'border-[#BBBBBB] bg-[#F8F8F8]'
                  }`}
                >
                  {selectedTime.period}
                </button>

                {/* Hour Selector */}
                <button
                  onClick={() => {
                    const newDropdowns = new Set(activeDropdowns);
                    if (newDropdowns.has('hour')) {
                      newDropdowns.delete('hour');
                    } else {
                      newDropdowns.add('hour');
                    }
                    setActiveDropdowns(newDropdowns);
                  }}
                  className={`w-[80px] h-[32px] text-[18px] border rounded-[4px] transition-colors ${
                    activeDropdowns.has('hour')
                      ? 'border-black bg-white'
                      : 'border-[#BBBBBB] bg-[#F8F8F8]'
                  }`}
                >
                  {selectedTime.hour}시
                </button>

                {/* Colon Separator */}
                <span className="text-black text-[18px] mx-[4px]">:</span>

                {/* Minute Selector */}
                <button
                  onClick={() => {
                    const newDropdowns = new Set(activeDropdowns);
                    if (newDropdowns.has('minute')) {
                      newDropdowns.delete('minute');
                    } else {
                      newDropdowns.add('minute');
                    }
                    setActiveDropdowns(newDropdowns);
                  }}
                  className={`w-[80px] h-[32px] text-[18px] border rounded-[4px] transition-colors ${
                    activeDropdowns.has('minute')
                      ? 'border-black bg-white'
                      : 'border-[#BBBBBB] bg-[#F8F8F8]'
                  }`}
                >
                  {selectedTime.minute.toString().padStart(2, '0')}분
                </button>
              </div>
            </div>
          </div>

          {/* 드롭다운 - AM/PM */}
          {activeDropdowns.has('period') && (
            <div className="absolute mt-[84px] left-[-32px] z-50 w-[68px] h-[76px] ml-[4px]">
              <div
                className="rounded-[8px] bg-white w-full h-full"
                style={{ boxShadow: '0px 0px 8px 0px #00000040' }}
              >
                <div className="p-[4px] gap-[4px]">
                  <div
                    className={`text-center text-[18px] py-[4px] px-[14px] rounded cursor-pointer transition-colors ${
                      selectedTime.period === 'AM' ? 'bg-[#E7E7E7] text-black' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePeriodChange('AM')}
                  >
                    AM
                  </div>
                  <div
                    className={`text-center text-[18px] py-[4px] px-[14px] rounded cursor-pointer transition-colors ${
                      selectedTime.period === 'PM'
                        ? 'bg-[#E7E7E7] text-black'
                        : 'hover:bg-[#E7E7E7]'
                    }`}
                    onClick={() => handlePeriodChange('PM')}
                  >
                    PM
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 드롭다운 - Hour */}
          {activeDropdowns.has('hour') && (
            <div className="absolute mt-[84px] left-[-32px] z-50 w-[88px] h-[436px] ml-[76px]">
              <div
                className="rounded-[8px] bg-white w-full h-full"
                style={{ boxShadow: '0px 0px 8px 0px #00000040' }}
              >
                <div className="p-[4px] gap-[4px]">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`text-center text-[18px] py-[4px] px-[14px] rounded cursor-pointer transition-colors ${
                        selectedTime.hour === hour
                          ? 'bg-[#E7E7E7] text-black'
                          : 'hover:bg-[#E7E7E7] cursor-pointer'
                      }`}
                      onClick={() => handleHourChange(hour)}
                    >
                      {hour}시
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 드롭다운 - Minute */}
          {activeDropdowns.has('minute') && (
            <div className="absolute mt-[84px] left-[-32px] z-50 w-[88px] h-[148px] ml-[172px]">
              <div
                className="rounded-[8px] bg-white w-full h-full"
                style={{ boxShadow: '0px 0px 8px 0px #00000040' }}
              >
                <div className="p-[4px] gap-[4px]">
                  {minutes.map((minute) => (
                    <div
                      key={minute}
                      className={`text-center text-[18px] py-[4px] px-[14px] rounded cursor-pointer transition-colors ${
                        selectedTime.minute === minute
                          ? 'bg-[#E7E7E7] text-black'
                          : 'hover:bg-[#E7E7E7] cursor-pointer'
                      }`}
                      onClick={() => handleMinuteChange(minute)}
                    >
                      {minute.toString().padStart(2, '0')}분
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
