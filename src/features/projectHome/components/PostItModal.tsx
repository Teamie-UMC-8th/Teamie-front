'use client';

import { useState } from 'react';

interface PostItModalProps {
  onClose: () => void;
  onSave: (content: string) => void;
}

export default function PostItModal({ onClose, onSave }: PostItModalProps) {
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 32) {
      setContent(value);
    }
  };

  // 내용이 비어있는지 확인
  const isEmpty = !content.trim();

  return (
    <div className="fixed inset-0 bg-[#00000033] rounded-[12px] flex items-center justify-center z-50">
      <div
        className="w-[600px] h-[364px] bg-white rounded-[12px] px-[60px] py-[44px] flex flex-col items-center relative"
        style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
      >
        <img
          src="/icons/CloseModal.svg"
          alt="닫기"
          className="absolute top-[8px] right-[8px] cursor-pointer"
          onClick={onClose}
        />
        <p className="text-[20px] font-semibold mt-[16px]">게시판에 메모를 남겨주세요.</p>
        <p className="text-[14px] text-[#898989] mt-[4px] mb-[20px]">
          포스트잇은 48시간 뒤 자동으로 삭제되며, 본인이 작성한 메모는 직접 삭제할 수 있어요.
        </p>

        <textarea
          className="w-[480px] h-[120px] border border-[#BBBBBB] rounded-[6px] px-[16px] py-[12px] resize-none"
          value={content}
          onChange={handleContentChange}
          placeholder="메모를 입력하세요"
          maxLength={32}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const newContent = content + '\n';
              if (newContent.length <= 32) {
                setContent(newContent);
              }
            }
          }}
        />
        <div className="text-[12px] text-[#898989] mt-[4px] self-end">{content.length}/32</div>
        <button
          className={`w-[184px] h-[34px] text-[18px] text-white font-bold rounded-[4px] mt-[16px] ${
            isEmpty ? 'bg-[#BAE5E4]' : 'bg-[#81D7D4] cursor-pointer'
          }`}
          onClick={handleSave}
          disabled={isEmpty}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
