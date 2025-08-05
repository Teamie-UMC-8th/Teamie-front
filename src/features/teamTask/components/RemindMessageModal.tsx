'use client';

import { useState } from 'react';

interface RemindMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleName: string;
  date: string;
  time: string;
  attendees: string[];
  location: string;
  detailUrl: string;
}

export default function RemindMessageModal({
  isOpen,
  onClose,
  scheduleName,
  date,
  time,
  attendees,
  location,
  detailUrl,
}: RemindMessageModalProps) {
  const [showCopyModal, setShowCopyModal] = useState(false);

  const generateMessage = () => {
    const relativeDate = getRelativeDate(date);
    const attendeeNames = attendees.length > 0 ? attendees.join(', ') : '미정';
    const locationText = location || '미정';

    // 날짜를 0월0일 형식으로 변환
    const [year, month, day] = date.split('-').map(Number);
    const dateMonthDay = `${month}월 ${day}일`;

    return `⏰ 다가오는 일정 알려드려요!
${scheduleName} - ${dateMonthDay} ${time} (${relativeDate})
👤 참석자: ${attendeeNames}
📍 장소: ${locationText}
👉 상세 내용 확인하기: ${detailUrl}`;
  };

  const getRelativeDate = (dateStr: string) => {
    // 현재 날짜를 로컬 시간대로 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 날짜 문자열을 로컬 시간대로 파싱
    const [year, month, day] = dateStr.split('-').map(Number);
    const scheduleDate = new Date(year, month - 1, day);
    scheduleDate.setHours(0, 0, 0, 0);

    const diffTime = scheduleDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays > 0) return `${diffDays}일 후`;
    return '';
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateMessage());
      setShowCopyModal(true);
      setTimeout(() => {
        setShowCopyModal(false);
      }, 5000);
    } catch {
      window.alert('텍스트 복사에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000033] rounded-[12px] flex items-center justify-center z-50">
      <div
        className="w-[564px] h-[328px] bg-white rounded-[12px] px-[40px] py-[32px] relative flex flex-col items-center"
        style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
      >
        <img
          src="/icons/CloseModal.svg"
          alt="닫기"
          className="absolute top-[8px] right-[8px] cursor-pointer"
          onClick={onClose}
        />

        <h2 className="text-[20px] font-semibold text-center mb-[20px]">
          일정 리마인드를 위해 메세지를 복사하여 <br />
          팀원들에게 전달하세요.
        </h2>

        <div className="bg-[#F8F8F8] rounded-[8px] relative p-[24px] w-[404px] h-[168px]">
          <p className="text-[16px] text-center mb-[16px] whitespace-pre-line">
            {generateMessage().split('👉 상세 내용 확인하기: ')[0]}
            👉 상세 내용 확인하기:{' '}
            <span
              className="text-[#81D7D4] underline font-bold cursor-pointer"
              onClick={() => window.open(detailUrl, '_blank')}
            >
              {scheduleName}
            </span>
          </p>

          <button
            className="absolute top-[12px] right-[12px] cursor-pointer"
            onClick={handleCopyText}
          >
            <img src="/icons/copy_url.svg" alt="copy_url" />
          </button>

          {/* 복사 완료 토스트 */}
          {showCopyModal && (
            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-[#F8F8F8] w-[234px] h-[34px] text-[#505050] px-[20px] py-[4px] border border-[#BBBBBB] rounded-[6px] text-[14px] whitespace-nowrap items-center">
                리마인드 메세지가 복사되었습니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
