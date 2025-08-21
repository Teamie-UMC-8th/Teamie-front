'use client';

import { useState, useEffect, useRef } from 'react';
import MiniDatePicker from './MiniDatePicker';
import AssigneeCard from './AssigneeCard';
import { TaskFilters } from '@/types/api/tasks';
import Image from 'next/image';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: (filters: TaskFilters) => void;
  onFilterChange?: (filters: TaskFilters) => void; // 필터 변경 시 즉시 호출
  assignees: Array<{ userId: number; name: string; imageUrl: string }>;
  buttonRect: DOMRect | null;
  initialFilters?: TaskFilters;
}

export default function FilterPanel({
  isOpen,
  onClose,
  onFilterChange,
  assignees,
  buttonRect,
  initialFilters,
}: FilterPanelProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialFilters?.statuses || []
  );
  const [selectedAssignees, setSelectedAssignees] = useState<number[]>(
    initialFilters?.managerIds || []
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialFilters?.dateBefore || initialFilters?.dateAfter
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);
  const [dateFilterType, setDateFilterType] = useState<'before' | 'after' | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 초기 필터가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (initialFilters) {
      setSelectedStatuses(initialFilters.statuses || []);
      setSelectedAssignees(initialFilters.managerIds || []);

      // 날짜 필터 초기화
      if (initialFilters.dateBefore && initialFilters.dateAfter) {
        // 범위 선택: 두 날짜가 모두 있는 경우
        setSelectedDate(initialFilters.dateAfter); // dateAfter가 시작일
        setSelectedEndDate(initialFilters.dateBefore); // dateBefore가 종료일
        setDateFilterType(null); // 범위 선택은 자동 감지되므로 null
      } else if (initialFilters.dateBefore) {
        // 이전 날짜만 있는 경우
        setSelectedDate(initialFilters.dateBefore);
        setDateFilterType('before');
        setSelectedEndDate(undefined);
      } else if (initialFilters.dateAfter) {
        // 이후 날짜만 있는 경우
        setSelectedDate(initialFilters.dateAfter);
        setDateFilterType('after');
        setSelectedEndDate(undefined);
      } else {
        // 날짜 필터가 없는 경우
        setSelectedDate(undefined);
        setSelectedEndDate(undefined);
        setDateFilterType(null);
      }
    }
  }, [initialFilters]); // initialFilters가 변경될 때만 실행

  // 현재 필터 상태를 TaskFilters 형태로 변환하는 함수
  const getCurrentFilters = (): TaskFilters => {
    let dateBefore: Date | undefined;
    let dateAfter: Date | undefined;

    if (selectedDate && selectedEndDate) {
      // 두 개 날짜가 선택된 경우: 자동으로 범위 선택
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedEndDate);
      if (startDate < endDate) {
        dateAfter = startDate;
        dateBefore = endDate;
      } else {
        dateAfter = endDate;
        dateBefore = startDate;
      }
    } else if (selectedDate) {
      if (dateFilterType === 'before') {
        dateBefore = selectedDate;
      } else if (dateFilterType === 'after') {
        dateAfter = selectedDate;
      }
    }

    return {
      statuses: selectedStatuses.map(getApiStatusValue),
      managerIds: selectedAssignees,
      dateBefore,
      dateAfter,
    };
  };

  // 필터 변경 시 즉시 콜백 호출
  const triggerFilterChange = () => {
    if (onFilterChange) {
      const filters = getCurrentFilters();
      onFilterChange(filters);
    }
  };

  // 상태 변경 시 필터 변경 트리거
  useEffect(() => {
    if (onFilterChange) {
      triggerFilterChange();
    }
  }, [selectedStatuses, selectedAssignees, selectedDate, selectedEndDate, dateFilterType]);

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // API 상태값으로 변환하는 함수
  const getApiStatusValue = (displayStatus: string): string => {
    switch (displayStatus) {
      case '시작 전':
        return 'NOTSTART';
      case '진행 중':
        return 'ONGOING';
      case '완료':
        return 'COMPLETED';
      default:
        return displayStatus;
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 필터 버튼 영역 확인 (트리거 버튼 클릭은 제외)
      const filterButton = document.querySelector('[data-filter-button]');
      const isClickOnFilterButton = filterButton?.contains(target);

      // 패널 영역 확인
      const isClickInsidePanel = panelRef.current?.contains(target);

      // 필터 버튼이나 패널 영역 밖을 클릭한 경우에만 닫기
      if (!isClickOnFilterButton && !isClickInsidePanel) {
        // 필터 패널을 닫을 때 현재 선택된 필터들을 부모에게 전달
        let dateBefore: Date | undefined;
        let dateAfter: Date | undefined;

        if (selectedDate && selectedEndDate) {
          // 두 개 날짜가 선택된 경우: 자동으로 범위 선택
          const startDate = new Date(selectedDate);
          const endDate = new Date(selectedEndDate);

          if (startDate <= endDate) {
            dateAfter = startDate; // 더 이른 날짜가 dateAfter (시작일)
            dateBefore = endDate; // 더 늦은 날짜가 dateBefore (종료일)
          } else {
            // 날짜 순서가 잘못된 경우 자동으로 교정
            dateAfter = endDate; // 더 이른 날짜가 dateAfter (시작일)
            dateBefore = startDate; // 더 늦은 날짜가 dateBefore (종료일)
          }
        } else if (selectedDate && dateFilterType) {
          // 하나 날짜만 선택된 경우: 이전/이후 옵션에 따라 설정
          if (dateFilterType === 'before') {
            dateBefore = selectedDate;
          } else if (dateFilterType === 'after') {
            dateAfter = selectedDate;
          }
        } else if (selectedDate) {
          // 날짜만 선택되고 타입이 없는 경우 (범위 선택의 첫 번째 날짜)
        }

        const currentFilters: TaskFilters = {
          statuses: selectedStatuses.map(getApiStatusValue), // API 상태값으로 변환
          managerIds: selectedAssignees,
          dateBefore,
          dateAfter,
        };

        onClose(currentFilters);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [
    isOpen,
    onClose,
    selectedStatuses,
    selectedAssignees,
    selectedDate,
    selectedEndDate,
    dateFilterType,
  ]);

  if (!isOpen || !buttonRect) return null;

  // 필터 패널 위치 계산
  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '44px',
    right: 0,
    zIndex: 50,
  };

  const handleAssigneeChange = (userId: number) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDateFilterChange = (type: 'before' | 'after' | null) => {
    setDateFilterType(type);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // 범위 선택 시 날짜 변경 처리
  const handleRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setSelectedDate(startDate);
    setSelectedEndDate(endDate);
  };

  const handleResetFilters = () => {
    setSelectedStatuses([]);
    setSelectedAssignees([]);
    setSelectedDate(undefined);
    setSelectedEndDate(undefined);
    setDateFilterType(null);

    // 초기화 후 필터 변경 콜백 호출
    if (onFilterChange) {
      onFilterChange({
        statuses: [],
        managerIds: [],
        dateBefore: undefined,
        dateAfter: undefined,
      });
    }
  };

  return (
    <div
      ref={panelRef}
      className="bg-white rounded-[8px] p-[12px] overflow-hidden"
      style={{
        ...panelStyle,
        width: '240px',
        boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* 완료 여부 섹션 */}
      <div className="flex justify-end mb-[4px]">
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-[4px] text-[14px] rounded-[24px] border px-3 py-1 border-black cursor-pointer"
        >
          <Image src="/icons/refresh.svg" alt="초기화" width={16} height={16} />
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
          <MiniDatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onRangeChange={handleRangeChange}
            initialRangeStart={selectedDate}
            initialRangeEnd={selectedEndDate}
          />
        </div>

        {/* 날짜 필터 옵션 */}
        <div className="flex justify-between mb-[28px]">
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
  );
}
