'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, Fragment, useEffect, useRef } from 'react';

interface DropdownItem {
  label: string;
  href: string;
  icon?: string;
  divider?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
  dropdownClassName?: string;
  width?: string;
}

export default function Dropdown({
  isOpen,
  onToggle,
  trigger,
  items,
  className = '',
  dropdownClassName = '',
  width = 'w-[16rem]', // 요청하신 대로 원상 복구
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 트리거 버튼 */}
      <div onClick={onToggle}>{trigger}</div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul
          data-dropdown-menu
          // rem 대신 px 단위를 사용하여 패딩을 지정합니다. (0.3125rem = 5px)
          className={`absolute mt-[0.75rem] bg-white rounded-[0.5rem] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-20 ${dropdownClassName} flex flex-col p-[5px]`}
        >
          {items.map((item, index) => (
            <Fragment key={index}>
              {/* 메뉴 아이템 */}
              <li className="h-[40px]">
                {item.onClick && !item.href ? (
                  <button
                    onClick={() => {
                      onToggle();
                      item.onClick?.();
                    }}
                    className={`flex h-full cursor-pointer items-center whitespace-nowrap rounded-[0.375rem] px-[1rem] text-left text-[1.125rem] text-[#505050] hover:bg-[#E7E7E7] ${width}`}
                  >
                    {item.icon && (
                      <Image
                        src={item.icon}
                        alt={item.label}
                        className="mr-[0.75rem] rounded-full"
                        width={24}
                        height={24}
                      />
                    )}
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => {
                      onToggle();
                      item.onClick?.();
                    }}
                    className={`flex h-full items-center whitespace-nowrap rounded-[0.375rem] px-[1rem] text-[1.125rem] text-[#505050] hover:bg-[#E7E7E7] ${width}`}
                  >
                    {item.icon && (
                      <Image
                        src={item.icon}
                        alt={item.label}
                        className="mr-[0.75rem] rounded-full"
                        width={24}
                        height={24}
                      />
                    )}
                    {item.label}
                  </Link>
                )}
              </li>

              {/* 구분선 */}
              {index < items.length - 1 && (
                <div className="h-[10px] flex items-center justify-center">
                  <div className="h-[1px] rounded-full bg-[#BBBBBB] w-full mx-[3px]"></div>
                </div>
              )}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
