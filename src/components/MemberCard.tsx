import React from 'react';

interface MemberCardProps {
  name?: string;
  role?: string;
  children?: React.ReactNode;
}

export default function MemberCard({ name, role, children }: MemberCardProps) {
  return (
    <div className="w-[315px] h-[409px] bg-white rounded-[12px] border border-[#BBBBBB] flex flex-col items-center p-6 shadow relative">
      <div className="absolute left-[95px] right-[95px] top-[36px] flex justify-center">
        <div className="w-[125px] h-[125px] bg-gray-200 rounded-full mb-4" />
      </div>
      <div className="flex flex-col items-center justify-end h-full pt-[180px]">
        <div className="text-lg font-bold mb-2">{name || '이름'}</div>
        <div className="text-gray-500 mb-4">{role || '역할'}</div>
        {children}
      </div>
    </div>
  );
}
