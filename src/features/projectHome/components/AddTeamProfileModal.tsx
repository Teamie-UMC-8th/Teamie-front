'use client';

import { useState } from 'react';
import { formatToKoreanDate } from '@/utils/formatDate';

interface AddTeamProfileModalProps {
  onClose: () => void;
  projectName?: string;
  inviteCode?: string;
  expiresAt?: string;
  onJoinClick?: () => void;
}

export default function AddTeamProfileModal({
  onClose,
  projectName = '프로젝트',
  inviteCode = 'INVITE123',
  expiresAt = '2024-12-31',
  onJoinClick,
}: AddTeamProfileModalProps) {
  const [showCopyModal, setShowCopyModal] = useState(false);

  const handleCopyText = async () => {
    const textToCopy = `💡 프로젝트에 참여해 주세요!
아래 링크를 통해 참여를 수락하면, 
바로 협업을 시작할 수 있어요.
👉 참여 링크: ${window.location.origin}/projects/join/${inviteCode}
링크 유효기간: ${formatToKoreanDate(expiresAt)}까지`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowCopyModal(true);
      setTimeout(() => {
        setShowCopyModal(false);
      }, 5000);
    } catch {
      window.alert('텍스트 복사에 실패했습니다.');
    }
  };

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

        <h2 className="text-[20px] font-semibold  text-center mb-[20px]">
          링크를 공유하여 <br />
          프로젝트에 팀원을 추가하세요.
        </h2>

        <div className="bg-[#F8F8F8] rounded-[8px] relative p-[24px] w-[404px] h-[168px]">
          <p className="text-[16px] text-center mb-[16px]">
            💡 프로젝트에 참여해 주세요!
            <br />
            아래 링크를 통해 참여를 수락하면, <br />
            바로 협업을 시작할 수 있어요.
            <br />
            👉 참여하기:{' '}
            <span
              className="underline font-bold text-[#81D7D4] cursor-pointer"
              onClick={() => {
                onJoinClick?.();
                onClose();
              }}
            >
              {projectName}
            </span>
            <br />
            링크 유효기간: {formatToKoreanDate(expiresAt)}까지
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
              <div className="bg-[#F8F8F8] w-[208px] h-[32px] text-[#505050] px-[20px] py-[4px] border border-[#BBBBBB] rounded-[6px] text-[14px] whitespace-nowrap items-center">
                초대 메세지가 복사되었습니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
