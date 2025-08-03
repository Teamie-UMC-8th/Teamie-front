'use client';

import { useState } from 'react';

interface TextFieldModalProps {
  type: 'goal' | 'rules';
  content: string;
  onClose: () => void;
  onSave: (content: string) => void;
}

export default function TextFieldModal({ type, content, onClose, onSave }: TextFieldModalProps) {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(editedContent);
    onClose();
  };

  const handleClose = () => {
    onSave(editedContent);
    onClose();
  };

  const getTitle = () => {
    return type === 'goal' ? '우리 팀의 목표' : '우리 팀의 규칙';
  };

  return (
    <div className="fixed inset-0 bg-[#00000033] rounded-[12px] flex items-center justify-center z-50">
      <div
        className="w-[816px] h-[448px] bg-white rounded-[12px] px-[40px] py-[32px] flex flex-col relative"
        style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
      >
        <img
          src="/icons/CloseModal.svg"
          alt="닫기"
          className="absolute top-[8px] right-[8px] cursor-pointer"
          onClick={handleClose}
        />
        <p className="text-[20px] font-semibold mb-[16px]">{getTitle()}</p>
        <textarea
          className="w-[736px] h-[334px] border border-[#BBBBBB] rounded-[6px] px-[32px] py-[24px] resize-none text-[18px]"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          maxLength={300}
        />
      </div>
    </div>
  );
}
