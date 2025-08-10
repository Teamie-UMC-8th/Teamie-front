'use client';

import { useRef, useState } from 'react';

interface ContributionSliderProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function ContributionSlider({ value, onChange }: ContributionSliderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleBarClick = (e: React.MouseEvent) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newValue = Math.round((clickX / rect.width) * 100);
    onChange(Math.min(100, Math.max(0, newValue)));
  };

  const handleSpanClick = () => {
    setIsEditing(true);
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const newValue = Math.min(100, Math.max(0, inputValue));
    onChange(newValue);
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleInputBlur();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
        기여도
      </div>
      <div className="flex items-center gap-[21px]">
        <div
          ref={barRef}
          onClick={handleBarClick}
          className="w-[299px] h-[20px] bg-white border border-[#BBBBBB] rounded-[3px] overflow-hidden cursor-pointer relative"
        >
          <div
            className="h-full bg-[#81D7D4] transition-all duration-300"
            style={{ width: `${value}%` }}
          />
        </div>
        {isEditing ? (
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={0}
            max={100}
            className="w-[42px] h-[28px] text-center border border-gray-300 rounded text-[18px]"
          />
        ) : (
          <span
            onClick={handleSpanClick}
            className="w-[42px] h-[28px] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-[28px] tracking-[0.04em] text-center cursor-pointer"
          >
            {value}%
          </span>
        )}
      </div>
    </div>
  );
}
