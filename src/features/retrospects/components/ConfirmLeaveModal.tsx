'use client';

import React from 'react';

interface ConfirmLeaveModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmLeaveModal({ onConfirm, onCancel }: ConfirmLeaveModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-[460px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[12px] px-[32px] pt-[40px] pb-[40px]">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-[8px] right-[8px] w-[24px] h-[24px] cursor-pointer"
          onClick={onCancel}
        >
          <img src="/icons/곱하기.svg" alt="닫기" className="w-[24px] h-[24px]" />
        </button>

        {/* 질문 문구 */}
        <h3 className="text-[20px] leading-[28px] font-semibold text-center text-black">
          팀원들과 이탈에 대해 협의가 되었나요?
        </h3>
        <p className="text-[14px] leading-[22px] text-[#898989] text-center mb-[32px]">
          프로젝트 이탈 이전에 팀원들과 먼저 협의해주세요.
        </p>

        {/* 버튼 그룹 */}
        <div className="flex justify-center gap-[28px]">
          <button
            onClick={onConfirm}
            className="w-[103px] h-[34px] bg-[#FFFFFF] border border-[#000000] rounded-[4px] 
                     text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] whitespace-nowrap cursor-pointer"
          >
            예
          </button>
          <button
            onClick={onCancel}
            className="w-[103px] h-[34px] bg-[#FFFFFF] border border-[#000000] rounded-[4px] 
                     text-[18px] leading-[26px] font-[Pretendard] font-normal text-[#000000] whitespace-nowrap cursor-pointer"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
