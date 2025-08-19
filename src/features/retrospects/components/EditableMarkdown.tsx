'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  initialValue?: string;
  onSave?: (value: string) => void;
}

export default function EditableMarkdown({ initialValue = '', onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = () => {
    setEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleBlur = () => {
    setEditing(false);
    onSave?.(content);
  };

  useEffect(() => {
    if (!editing) return;
    if (!textareaRef.current) return;
  }, [content, editing]);

  return (
    <div onClick={handleClick}>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          className="w-[1311px] h-[344px] bg-white border border-[#BBBBBB] rounded-[12px]
                     p-[16px] text-[18px] leading-[26px] text-black font-[Pretendard] font-normal
                     resize-none overflow-hidden box-border
                     max-lg:w-[814px] max-lg:text-[16px] max-lg:leading-[24px] max-lg:h-[344px]"
        />
      ) : (
        <div
          className="w-[1311px] h-[344px] bg-white border border-[#BBBBBB] rounded-[12px]
                        p-[16px] text-[16px] text-black box-border max-lg:w-[814px] max-lg:h-[344px]"
        >
          <ReactMarkdown>{content || ' '}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
