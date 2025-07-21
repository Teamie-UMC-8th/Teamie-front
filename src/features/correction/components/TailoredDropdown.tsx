'use client';

import { useState } from 'react';

const TAILORED_OPTIONS = [
  { label: '정규직', color: 'bg-[#BED9FB]' },
  { label: '계약직', color: 'bg-[#CDE3C9]' },
  { label: '인턴', color: 'bg-[#F7DFC4]' },
  { label: '활동', color: 'bg-[#FBD5D5]' },
];

export default function TailoredDropdown() {
  const [selected, setSelected] = useState(TAILORED_OPTIONS[0]); // '정규직' 초기값
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: (typeof TAILORED_OPTIONS)[number]) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div className="flex">
        {/* 선택된 상태 표시 */}
        <button
          onClick={toggleDropdown}
          className={`w-[80px] h-[34px] ${selected.color} grid place-items-center rounded-[4px] ml-[28px]`}
        >
          {selected.label}
        </button>

        {/* 드롭다운 아이콘 */}
        <img
          src="/icons/drop-down.svg"
          alt="드롭다운"
          className=" ml-[4px] cursor-pointer"
          onClick={toggleDropdown}
        />
      </div>
      {/* 옵션 목록 */}
      {isOpen && (
        <div
          className="absolute mt-[10px] w-[94px] h-[176px] bg-white rounded-[4px] shadow- z-10 p-[8px] right-0"
          style={{ boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)' }}
        >
          {TAILORED_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSelect(option)}
              className={`w-[80px] h-[34px] ${option.color} rounded-[4px] mb-[8px] last:mb-0 cursor-pointer`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
