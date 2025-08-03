'use client';

import { useState } from 'react';

interface TextFieldProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  showFullViewButton?: boolean;
  onFullViewClick?: () => void;
}

export default function TextField({
  title,
  placeholder,
  value,
  onChange,
  maxLength = 430,
  showFullViewButton = false,
  onFullViewClick,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // 보여줄 텍스트 결정 (입력 중이면 전체, 아니면 240글자로 제한)
  const displayValue = isFocused ? value : value.slice(0, 240);

  return (
    <div>
      <div className="flex justify-between items-end">
        <p className="text-[22px] font-semibold">{title}</p>
        {showFullViewButton && onFullViewClick && (
          <button className="text-[18px] text-[#898989] cursor-pointer" onClick={onFullViewClick}>
            + 전체보기
          </button>
        )}
      </div>
      <textarea
        className="w-[688px] h-[232px] border-[2px] border-[#BBBBBB] rounded-[8px] text-[18px] px-[30px] py-[18px] mt-[24px]
        max-lg:w-[862px] max-lg:h-[220px] resize-none [&::-webkit-scrollbar]:hidden"
        style={{
          lineHeight: '32px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={maxLength}
      />
    </div>
  );
}
