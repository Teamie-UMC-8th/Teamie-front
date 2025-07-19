"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  initialValue?: string;
  onSave?: (value: string) => void;
}

export default function EditableMarkdown({ initialValue = "", onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setEditing(false);
    onSave?.(content);
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          className="w-full min-h-[344px] bg-white border border-[#BBBBBB] rounded-[12px]
                     p-[16px] text-[18px] leading-[26px] text-black font-[Pretendard] font-normal
                     resize-none box-border
                     max-lg:text-[16px] max-lg:leading-[24px] max-lg:min-h-[310px]"
        />
      ) : (
        <div className="w-full min-h-[344px] bg-white border border-[#BBBBBB] rounded-[12px]
                        p-[16px] text-[16px] text-black box-border max-lg:min-h-[310px]">
          <ReactMarkdown>{content || " "}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
