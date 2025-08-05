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

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    onTimeChange({ ...selectedTime, period });
  };

  const handleHourChange = (hour: number) => {
    onTimeChange({ ...selectedTime, hour });
  };

  const handleMinuteChange = (minute: number) => {
    onTimeChange({ ...selectedTime, minute });
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <>
          <div
            className="absolute mt-8 left-[-32px] bg-white rounded-lg z-50 w-[260px] h-[48px]"
            style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
          >
            <div className="p-[8px]">
              {/* Time Selection */}
              <div className="flex items-center justify-center">
                {/* AM/PM Selector */}
                <div className="flex">
                  <button
                    onClick={() => handlePeriodChange('AM')}
                    className={`w-[60px] h-[32px] text-[18px] border border-[#BBBBBB] bg-[#F8F8F8] rounded-[4px] transition-colors mr-[12px] ${
                      selectedTime.period === 'AM' ? 'bg-[#F8F8F8] text-black' : ''
                    }`}
                  >
                    AM
                  </button>
                </div>

                {/* Hour Selector */}
                <button
                  className="w-[80px] h-[32px] text-[18px] border border-[#BBBBBB] bg-[#F8F8F8] rounded-[4px] transition-colors"
                  onClick={() => {
                    const currentIndex = hours.indexOf(selectedTime.hour);
                    const nextIndex = (currentIndex + 1) % hours.length;
                    handleHourChange(hours[nextIndex]);
                  }}
                >
                  {selectedTime.hour}시
                </button>

                {/* Colon Separator */}
                <span className="text-black text-[18px] mx-[4px]">:</span>

                {/* Minute Selector */}
                <button
                  className="w-[80px] h-[32px] text-[18px] border border-[#BBBBBB] bg-[#F8F8F8] rounded-[4px] transition-colors"
                  onClick={() => {
                    const currentIndex = minutes.indexOf(selectedTime.minute);
                    const nextIndex = (currentIndex + 1) % minutes.length;
                    handleMinuteChange(minutes[nextIndex]);
                  }}
                >
                  {selectedTime.minute.toString().padStart(2, '0')}분
                </button>
              </div>
            </div>
          </div>

          {/* 컬럼 드롭다운 */}
          <div className="absolute mt-[84px] left-[-32px] z-50 w-[252px] h-[300px] ml-[4px]">
            <div className="flex gap-[4px]">
              {/* AM/PM Selector Column */}
              <div
                className="rounded-[8px] bg-white w-[68px] h-[76px]"
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

              {/* Hour Selector Column */}
              <div
                className="rounded-[8px] bg-white w-[88px] h-[436px]"
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

              {/* Minute Selector Column */}
              <div
                className="rounded-[8px] bg-white w-[88px] h-[148px]"
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
          </div>
        </>
      )}
    </div>
  );
}
