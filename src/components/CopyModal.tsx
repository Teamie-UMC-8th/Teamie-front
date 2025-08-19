'use client';

import { useState } from 'react';
import { CopyModalProps } from '@/types/copyModal';
import Image from 'next/image';

const CopyModal = ({
  isOpen,
  onClose,
  headerText,
  messageContent,
  textToCopy,
  copySuccessText,
  innerPaddingX,
  onCopy,
}: CopyModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      onCopy?.();

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-[0.75rem] shadow-[0_0_15px_0_rgba(0,0,0,0.2)] px-[5rem] py-[2.5rem] text-center">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-[0.75rem] right-[0.75rem] text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          <Image src="/icons/close.svg" alt="close" width={24} height={24} />
        </button>
        <div className="mb-[1.5rem]">
          <h1 className="text-[1.25rem] font-semibold text-black leading-[28px]">
            {headerText.split('<br>').map((line, index) => (
              <span key={index}>
                {line}
                {index < headerText.split('<br>').length - 1 && <br />}
              </span>
            ))}
          </h1>
        </div>
        <div
          className="bg-[#F8F8F8] rounded-xl relative py-[1.5rem]"
          style={{ paddingLeft: innerPaddingX, paddingRight: innerPaddingX }}
        >
          <button
            onClick={handleCopy}
            className="absolute top-[0.75rem] right-[0.75rem] cursor-pointer"
          >
            <Image src="/icons/copy_url.svg" alt="copy_url" width={15} height={18} />
          </button>
          <div className="text-center text-[1rem] text-black">{messageContent}</div>
        </div>
        {isCopied && (
          <div className="absolute bottom-[1.25rem] left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-[#F8F8F8] text-[#505050] leading-[22px] px-[1.25rem] py-[6px] border-[0.09375rem] border-[#BBBBBB] rounded-[0.375rem] text-[0.875rem] whitespace-nowrap">
              {copySuccessText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyModal;
