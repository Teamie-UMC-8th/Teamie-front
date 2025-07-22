'use client';

import { useState } from 'react';

const COMMENT_OPTIONS = [
  { label: '대댓글 등록', icon: '/icons/reply.svg', action: 'reply' },
  { label: '댓글 수정', icon: '/icons/edit.svg', action: 'edit' },
  { label: '댓글 삭제', icon: '/icons/deletecomment.svg', action: 'delete' },
];

export default function CommentMenuDropdown({ onSelect }: { onSelect: (action: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (action: string) => {
    onSelect(action);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={toggleDropdown}
        className="absolute right-[8px] top-1/2 -translate-y-1/2 cursor-pointer group-hover:block hidden"
      >
        <img src="/icons/comment-dropdown.svg" alt="댓글 드롭다운" />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-[10px] w-[222px] h-[150px] bg-white rounded-[8px] z-10 px-[12px] py-[10px]"
          style={{ boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)' }}
        >
          {COMMENT_OPTIONS.map((option, idx) => (
            <div className="relative" key={option.label}>
              <button
                onClick={() => handleSelect(option.action)}
                className="flex items-center gap-[12px] w-full cursor-pointer"
              >
                <img src={option.icon} alt={option.label} className="w-[32px] h-[32px]" />
                <span className="text-[18px] text-[#505050]">{option.label}</span>
              </button>
              {idx < COMMENT_OPTIONS.length - 1 && (
                <hr className=" border-[1px] border-[#BBBBBB] my-[8px] w-[202px] " />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
