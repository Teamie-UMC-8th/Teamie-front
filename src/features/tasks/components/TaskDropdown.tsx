'use client';

import { useState, useEffect, useRef } from 'react';

const STATUS_OPTIONS = [
  { label: '시작 전', value: 'NOTSTART' as const, color: 'bg-[#E7E7E7]' },
  { label: '진행 중', value: 'ONGOING' as const, color: 'bg-[#B6F5DF]' },
  { label: '완료', value: 'COMPLETED' as const, color: 'bg-[#A1C2ED]' },
] as const;

interface TaskDropdownProps {
  status: 'ONGOING' | 'COMPLETED' | 'NOTSTART';
  onChange?: (status: 'ONGOING' | 'COMPLETED' | 'NOTSTART') => void;
  readOnly?: boolean;
}

export default function TaskDropdown({ status, onChange, readOnly = false }: TaskDropdownProps) {
  const [selected, setSelected] = useState(
    () => STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = STATUS_OPTIONS.find((s) => s.value === status);
    if (match) {
      console.log('TaskDropdown - 상태 업데이트:', { currentStatus: status, matchedOption: match });
      setSelected(match);
    }
  }, [status]);

  const toggleDropdown = () => {
    if (readOnly) return;
    setIsOpen(!isOpen);
  };

  // 빈 곳 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: (typeof STATUS_OPTIONS)[number]) => {
    console.log('TaskDropdown - 상태 선택:', option);
    console.log('TaskDropdown - 현재 선택된 상태:', selected);

    setSelected(option);
    setIsOpen(false);
    console.log('TaskDropdown - onChange 호출:', option.value);
    if (onChange) {
      const newStatus: 'ONGOING' | 'COMPLETED' | 'NOTSTART' = option.value;
      console.log('TaskDropdown - 새로운 상태:', newStatus);
      onChange(newStatus);
    } else {
      console.warn('TaskDropdown - onChange 함수가 없습니다.');
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className="flex">
        {/* 선택된 상태 표시 */}
        <button
          onClick={toggleDropdown}
          className={`w-[80px] h-[34px] ${selected.color} grid place-items-center rounded-[4px] ml-[28px] ${readOnly ? '' : ''}`}
        >
          {selected.label}
        </button>
        <img
          src="/icons/drop-down.svg"
          alt="드롭다운"
          className={` ml-[4px] ${readOnly ? '' : 'cursor-pointer'}`}
          onClick={toggleDropdown}
        />
      </div>
      {/* 옵션 목록 */}
      {isOpen && !readOnly && (
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
