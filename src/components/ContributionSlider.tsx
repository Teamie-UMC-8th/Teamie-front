'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ContributionSliderProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function ContributionSlider({ value, onChange }: ContributionSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // props의 value가 변경될 때 inputValue 동기화
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 입력 모드 활성화 시 자동 포커스 및 텍스트 선택
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBarClick = (e: React.MouseEvent) => {
    if (!barRef.current) return;
    setIsActive(true);
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newValue = Math.round((clickX / rect.width) * 100);
    onChange(Math.min(100, Math.max(0, newValue)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleBarClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newValue = Math.round((clickX / rect.width) * 100);
      onChange(Math.min(100, Math.max(0, newValue)));
    }
  };

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && barRef.current) {
        const rect = barRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newValue = Math.round((clickX / rect.width) * 100);
        onChange(Math.min(100, Math.max(0, newValue)));
      }
    },
    [isDragging, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // 드래그가 끝나도 화살표는 유지
    setIsActive(true);
  }, []);

  const handleSpanClick = () => {
    setIsEditing(true);
    setInputValue(value);
  };

  const handleSave = () => {
    const newValue = Math.min(100, Math.max(0, inputValue));
    if (newValue !== value) {
      onChange(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  // 드래그 중일 때 전역 마우스 이벤트 리스너 추가
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleGlobalMouseMove, handleMouseUp]);

  // 외부 클릭 시 활성 상태 해제
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // 컴포넌트 전체 영역을 벗어난 클릭인 경우에만 화살표 숨김
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-[28px]">
      <div className="w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
        기여도
      </div>
      <div className="flex items-center gap-[21px]">
        <div className="relative">
          <div
            ref={barRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-[299px] h-[20px] bg-white border border-[#BBBBBB] rounded-[3px] cursor-pointer relative"
          >
            <div className="h-full bg-[#81D7D4]" style={{ width: `${value}%` }} />
          </div>
          {/* ProgressBar.svg를 슬라이더 바 밖으로 완전히 배치 */}
          {isActive && (
            <div
              className="absolute cursor-pointer w-[24px] h-[31px]"
              style={{ left: `${value}%`, transform: 'translateX(-50%)', top: '-29px' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <Image
                src="/icons/ProgressBar .svg"
                alt="드래그 핸들"
                width={24}
                height={31}
                draggable={false}
              />
            </div>
          )}
        </div>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setInputValue(Number(val) || 0);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-[42px] h-[28px] text-center border-0 bg-transparent text-[20px] font-[Pretendard] font-normal leading-[28px] tracking-[0.04em] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none"
            placeholder="0"
          />
        ) : (
          <div
            onClick={handleSpanClick}
            className="w-[42px] h-[28px] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-[28px] tracking-[0.04em] text-center cursor-pointer  transition-colors flex items-center justify-center"
          >
            {value}%
          </div>
        )}
      </div>
    </div>
  );
}
