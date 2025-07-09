'use client';

import { useState } from 'react';

const STATUS_OPTIONS = [
  { label: '시작 전', color: 'bg-[#E7E7E7]' },
  { label: '진행 중', color: 'bg-[#B6F5DF]' },
  { label: '완료', color: 'bg-[#A1C2ED]' },
];

export default function TaskDropdown() {
  const [selected, setSelected] = useState(STATUS_OPTIONS[0]); // '시작 전' 초기값
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: (typeof STATUS_OPTIONS)[number]) => {
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
          className="absolute mt-[10px] w-[96px] h-[134px] bg-white rounded-[4px] shadow- z-10 p-[8px] right-0"
          style={{ boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)' }}
        >
          {STATUS_OPTIONS.map((option) => (
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
