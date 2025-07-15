'use client';

import React from 'react';

interface FinalLeaveModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function FinalLeaveModal({ onConfirm, onCancel }: FinalLeaveModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] p-[32px] shadow-md text-center relative w-[360px] border-[2px] border-[#3286FF]">
        <button onClick={onCancel} className="absolute top-[16px] right-[16px] text-gray-400 text-xl">×</button>
        <p className="text-[18px] font-bold mb-[32px]">정말 이탈하시겠습니까?</p>
        <div className="flex justify-center gap-[20px]">
          <button onClick={onConfirm} className="border px-[24px] py-[8px] rounded-[6px] font-bold">예</button>
          <button onClick={onCancel} className="border px-[24px] py-[8px] rounded-[6px] font-bold">아니오</button>
        </div>
      </div>
    </div>
  );
}
