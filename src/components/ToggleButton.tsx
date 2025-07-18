'use client';

import { useState } from 'react';

interface ToggleButtonProps {
  leftLabel: string;
  rightLabel: string;
  onToggle?: (isLeftSelected: boolean) => void;
}

export default function ToggleButton({ leftLabel, rightLabel, onToggle }: ToggleButtonProps) {
  const [isLeftSelected, setIsLeftSelected] = useState(true);

  const handleToggle = (isLeft: boolean) => {
    setIsLeftSelected(isLeft);
    onToggle?.(isLeft);
  };

  return (
    <div className="mr-auto">
      <div className="flex items-center mt-[20px] p-[4px] bg-[#F8F8F8] border border-[#E7E7E7] rounded-[4px]">
        <button
          onClick={() => handleToggle(true)}
          className={`relative px-4 py-1 rounded text-[18px] text-center ${
            isLeftSelected ? 'bg-[#81D7D4] text-white font-bold' : 'bg-[#F8F8F8] text-gray-700'
          }`}
        >
          <span className="invisible font-bold block h-0">{leftLabel}</span>
          <span>{leftLabel}</span>
        </button>

        <button
          onClick={() => handleToggle(false)}
          className={`relative px-4 py-1 rounded text-[18px] text-center ${
            !isLeftSelected ? 'bg-[#81D7D4] text-white font-bold' : 'bg-[#F8F8F8] text-gray-700'
          }`}
        >
          <span className="invisible font-bold block h-0">{rightLabel}</span>
          <span>{rightLabel}</span>
        </button>
      </div>
    </div>
  );
}
