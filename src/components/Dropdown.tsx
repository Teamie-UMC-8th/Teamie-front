'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface DropdownItem {
  label: string;
  href: string;
  icon?: string;
  divider?: boolean;
}

interface DropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
  dropdownClassName?: string;
}

export default function Dropdown({
  isOpen,
  onToggle,
  trigger,
  items,
  className = '',
  dropdownClassName = '',
}: DropdownProps) {
  return (
    <div className={`relative ${className}`}>
      {/* 트리거 버튼 */}
      <div onClick={onToggle}>{trigger}</div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul
          data-dropdown-menu
          className={`absolute mt-[0.75rem] bg-white rounded-[0.5rem] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-20 ${dropdownClassName}`}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className="mx-[0.5rem] border-b-[0.125rem] border-[#BBBBBB] last:border-none"
            >
              <Link
                href={item.href}
                onClick={onToggle}
                className="block pl-[0.75rem] pr-[9.375rem] py-[0.75rem] text-[#505050] text-[1.125rem] whitespace-nowrap flex items-center"
              >
                {item.icon && <img src={item.icon} alt="" className="mr-[0.75rem]" />}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
