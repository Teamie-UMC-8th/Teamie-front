'use client';

import React from 'react';

interface ConfirmLeaveModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmLeaveModal({ onConfirm, onCancel }: ConfirmLeaveModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] p-[32px] shadow-md text-center relative w-[400px]">
        <button onClick={onCancel} className="absolute top-[16px] right-[16px] text-gray-400 text-xl">×</button>
        <p className="text-[18px] font-bold mb-[8px]">팀원들과 이탈에 대해 협의가 되었나요?</p>
        <p className="text-[14px] text-[#888888] mb-[32px]">
          프로젝트 이탈 이전에 팀원들과 먼저 협의해주세요.
        </p>
        <div className="flex justify-center gap-[20px]">
          <button onClick={onConfirm} className="border px-[24px] py-[8px] rounded-[6px] font-bold">예</button>
          <button onClick={onCancel} className="border px-[24px] py-[8px] rounded-[6px] font-bold">아니오</button>
        </div>
      </div>
    </div>
  );
}
