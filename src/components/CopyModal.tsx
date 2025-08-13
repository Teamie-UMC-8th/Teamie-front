import { useState } from 'react';
import { CopyModalProps } from '@/types/copyModal';

const CopyModal = ({
  isOpen,
  onClose,
  headerText,
  messageText,
  copySuccessText,
  innerPaddingX,
  onCopy,
}: CopyModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // <br> 태그를 실제 줄바꿈으로 변환
      const textToCopy = messageText.replace(/<br>/g, '\n');
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      onCopy?.();

      // 3초 후 복사 성공 메시지 숨기기
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-opacity-50" onClick={onClose} />

      {/* 모달 */}
      <div className="relative bg-white rounded-[0.75rem] shadow-[0_0_15px_0_rgba(0,0,0,0.2)] px-[5rem] py-[2.5rem] text-center">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-[0.75rem] right-[0.75rem] text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          <img src="/icons/곱하기.svg" alt="close" />
        </button>

        {/* 헤더 */}
        <div className="mb-[1.5rem]">
          <h1 className="text-[1.25rem] font-semibold text-black leading-relaxed">
            {headerText.split('<br>').map((line: string, index: number) => (
              <span key={index}>
                {line}
                {index < headerText.split('<br>').length - 1 && <br />}
              </span>
            ))}
          </h1>
        </div>

        {/* 메시지 박스 */}
        <div
          className="bg-[#F8F8F8] rounded-xl relative py-[1.5rem]"
          style={{ paddingLeft: innerPaddingX, paddingRight: innerPaddingX }}
        >
          <button
            className="absolute top-[0.75rem] right-[0.75rem] cursor-pointer"
            onClick={handleCopy}
          >
            <img src="/icons/copy_url.svg" alt="copy_url" />
          </button>

          {/* 메시지 내용 */}
          <div className="text-left text-[1rem] text-black">
            {messageText.split('<br>').map((line: string, index: number) => (
              <span key={index}>
                {line}
                {index < messageText.split('<br>').length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>

        {/* 복사 성공 메시지 */}
        {isCopied && (
          <div className="absolute bottom-[1.25rem] left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-[#F8F8F8] text-[#505050] px-[1.25rem] py-[0.5rem] border-[0.09375rem] border-[#BBBBBB] rounded-[0.375rem] lg:text-[1.125rem] text-[1rem] whitespace-nowrap">
              {copySuccessText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyModal;
