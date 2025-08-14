'use client';

import { useState } from 'react';
import MiniDatePicker from './MiniDatePicker';
import AssigneeCard from './AssigneeCard';
import Portal from './Portal';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  assignees: Array<{ userId: number; name: string; imageUrl: string }>;
  buttonRect: DOMRect | null;
}

export default function FilterPanel({ isOpen, onClose, assignees, buttonRect }: FilterPanelProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateFilterType, setDateFilterType] = useState<'before' | 'after' | null>(null);

  if (!isOpen || !buttonRect) return null;

  // 필터 패널 위치 계산
  const panelStyle = {
    position: 'absolute' as const,
    top: `${buttonRect.bottom + 12}px`, // 필터 아이콘 아래 12px 간격
    left: `${buttonRect.right - 240}px`, // 필터 아이콘 오른쪽 끝에서 패널 너비만큼 왼쪽으로
    zIndex: 50,
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleAssigneeChange = (userId: number) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDateFilterChange = (type: 'before' | 'after') => {
    setDateFilterType((prev) => (prev === type ? null : type));
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleReset = () => {
    setSelectedStatuses([]);
    setSelectedAssignees([]);
    setSelectedDate(undefined);
    setDateFilterType(null);
  };

  return (
    <Portal>
      <div
        className="bg-white rounded-[8px] p-[12px]"
        style={{
          ...panelStyle,
          width: '240px',
          boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* 완료 여부 섹션 */}
        <div className="flex justify-end mb-[4px]">
          <button
            onClick={handleReset}
            className="flex items-center gap-[4px] text-[14px] rounded-[24px] border px-3 py-1 border-black cursor-pointer"
          >
            <img src="/icons/refresh.svg" alt="초기화" className="w-4 h-4" />
            초기화
          </button>
        </div>
        <div className="mb-[40px] px-[8px]">
          <div className="flex-1 justify-between items-center mb-[4px]">
            <div className="mb-[20px] text-[18px] px-[4px] font-bold border-b-[2px] border-[#E7E7E7]">
              완료 여부
            </div>
          </div>
          <div className="space-y-2">
            {['시작 전', '진행 중', '완료'].map((status) => (
              <label
                key={status}
                className="flex items-center leading-[26px] gap-[12px] cursor-pointer text-[18px] px-[12px]"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => handleStatusChange(status)}
                    className="peer appearance-none flex justify-center items-center w-[20px] h-[20px] border-[2px] border-[#898989] rounded-[4px] bg-white cursor-pointer checked:bg-[#81D7D4]"
                  />
                  <svg
                    className="hidden peer-checked:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    width="13"
                    height="12"
                    viewBox="0 0 13 12"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.8383 12C4.41459 12 4.0133 11.826 3.75615 11.526L0.275947 7.47901C0.168101 7.35411 0.0893379 7.21171 0.0441773 7.05996C-0.00098324 6.90821 -0.0116524 6.7501 0.0127817 6.59472C0.0372158 6.43933 0.0962722 6.28972 0.186563 6.15447C0.276853 6.01922 0.396601 5.90099 0.538935 5.80656C0.680907 5.71139 0.842861 5.64185 1.01548 5.60195C1.1881 5.56206 1.36798 5.5526 1.54477 5.57411C1.72156 5.59562 1.89177 5.64768 2.04562 5.72729C2.19947 5.80691 2.33391 5.91251 2.44121 6.03802L4.73115 8.69884L10.4886 0.562076C10.6796 0.293422 10.9838 0.102387 11.3346 0.0308751C11.6853 -0.040637 12.054 0.0132126 12.3597 0.180612C12.9958 0.528644 13.1916 1.26586 12.7942 1.82648L5.99155 11.4359C5.87542 11.6007 5.71536 11.7381 5.52525 11.8361C5.33515 11.9341 5.12074 11.9897 4.90063 11.9983L4.8383 12Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span className="text-[18px]">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 담당자 섹션 */}
        <div className="mb-[40px] px-[8px]">
          <div className="mb-[20px] text-[18px] px-[4px] font-bold border-b-[2px] border-[#E7E7E7]">
            담당자
          </div>
          <div className="space-y-2">
            {assignees.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">담당자가 없습니다.</div>
            ) : (
              assignees.map((assignee) => (
                <label
                  key={assignee.userId}
                  className="flex items-center gap-[12px] cursor-pointer px-[12px]"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedAssignees.includes(assignee.userId)}
                      onChange={() => handleAssigneeChange(assignee.userId)}
                      className="peer appearance-none flex justify-center items-center w-[20px] h-[20px] border-[2px] border-[#898989] rounded bg-white cursor-pointer checked:bg-[#81D7D4]"
                    />
                    <svg
                      className="hidden peer-checked:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.8383 12C4.41459 12 4.0133 11.826 3.75615 11.526L0.275947 7.47901C0.168101 7.35411 0.0893379 7.21171 0.0441773 7.05996C-0.00098324 6.90821 -0.0116524 6.7501 0.0127817 6.59472C0.0372158 6.43933 0.0962722 6.28972 0.186563 6.15447C0.276853 6.01922 0.396601 5.90099 0.538935 5.80656C0.680907 5.71139 0.842861 5.64185 1.01548 5.60195C1.1881 5.56206 1.36798 5.5526 1.54477 5.57411C1.72156 5.59562 1.89177 5.64768 2.04562 5.72729C2.19947 5.80691 2.33391 5.91251 2.44121 6.03802L4.73115 8.69884L10.4886 0.562076C10.6796 0.293422 10.9838 0.102387 11.3346 0.0308751C11.6853 -0.040637 12.054 0.0132126 12.3597 0.180612C12.9958 0.528644 13.1916 1.26586 12.7942 1.82648L5.99155 11.4359C5.87542 11.6007 5.71536 11.7381 5.52525 11.8361C5.33515 11.9341 5.12074 11.9897 4.90063 11.9983L4.8383 12Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <AssigneeCard
                    name={assignee.name}
                    imageUrl={assignee.imageUrl}
                    size="md"
                    showCheckbox={false}
                  />
                </label>
              ))
            )}
          </div>
        </div>

        {/* 날짜 섹션 */}
        <div className="px-[8px]">
          <div className="mb-[20px] text-[18px] px-[4px] font-bold border-b-[2px] border-[#E7E7E7]">
            날짜
          </div>

          {/* MiniDatePicker */}
          <div className="mb-[4rem] flex justify-center">
            <MiniDatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
          </div>

          {/* 날짜 필터 옵션 */}
          <div className="flex justify-between px-2 mb-[28px]">
            {['이전', '이후'].map((type) => (
              <label
                key={type}
                className="flex items-center gap-[12px] cursor-pointer whitespace-nowrap"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={dateFilterType === (type === '이전' ? 'before' : 'after')}
                    onChange={() => handleDateFilterChange(type === '이전' ? 'before' : 'after')}
                    className="peer appearance-none flex justify-center items-center w-[20px] h-[20px] border-[2px] border-[#898989] rounded bg-white cursor-pointer checked:bg-[#81D7D4]"
                  />
                  <svg
                    className="hidden peer-checked:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    width="13"
                    height="12"
                    viewBox="0 0 13 12"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.8383 12C4.41459 12 4.0133 11.826 3.75615 11.526L0.275947 7.47901C0.168101 7.35411 0.0893379 7.21171 0.0441773 7.05996C-0.00098324 6.90821 -0.0116524 6.7501 0.0127817 6.59472C0.0372158 6.43933 0.0962722 6.28972 0.186563 6.15447C0.276853 6.01922 0.396601 5.90099 0.538935 5.80656C0.680907 5.71139 0.842861 5.64185 1.01548 5.60195C1.1881 5.56206 1.36798 5.5526 1.54477 5.57411C1.72156 5.59562 1.89177 5.64768 2.04562 5.72729C2.19947 5.80691 2.33391 5.91251 2.44121 6.03802L4.73115 8.69884L10.4886 0.562076C10.6796 0.293422 10.9838 0.102387 11.3346 0.0308751C11.6853 -0.040637 12.054 0.0132126 12.3597 0.180612C12.9958 0.528644 13.1916 1.26586 12.7942 1.82648L5.99155 11.4359C5.87542 11.6007 5.71536 11.7381 5.52525 11.8361C5.33515 11.9341 5.12074 11.9897 4.90063 11.9983L4.8383 12Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span className="text-[18px]">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}
