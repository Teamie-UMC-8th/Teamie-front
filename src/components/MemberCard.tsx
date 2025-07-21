import Image from 'next/image';

import React from 'react';

interface MemberCardProps {
  name?: string;
  school?: string;
  email?: string;
  role?: string;
  tasks?: string;
  children?: React.ReactNode;
}

export default function MemberCard({
  name,
  school,
  email,
  role,
  tasks,
  children,
}: MemberCardProps) {
  return (
    <div className="w-[315px] h-[409px] bg-white rounded-[12px] border border-[#BBBBBB] flex flex-col items-center p-6 shadow relative">
      <div className="absolute left-[95px] right-[95px] top-[36px] flex justify-center flex-col items-center">
        <Image
          src="/icons/profile-image.svg"
          alt="프로필"
          width={125}
          height={125}
          className="mb-0" // 이름과의 간격 12px
        />
        <div className="text-lg font-bold text-center">{name || '이름'}</div>
      </div>

      <div className="flex flex-col justify-end h-full pt-[220px] gap-3 w-full">
        <div className="flex items-center gap-2 ml-[40px]">
          <Image
            src="/icons/school.svg"
            alt="school"
            width={24}
            height={24}
            className="inline-block"
          />
          <span>{school || '대학교'}</span>
        </div>

        <div className="flex items-center gap-2 ml-[40px]">
          <Image
            src="/icons/email.svg"
            alt="email"
            width={24}
            height={24}
            className="inline-block"
          />
          <span>{email || '이메일@example.com'}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 ml-[40px]">
          <Image
            src="/icons/position.svg"
            alt="역할"
            width={24}
            height={24}
            className="inline-block"
          />
          <span>{role || '기획'}</span>
        </div>

        <div className="flex items-center gap-2 ml-[40px]">
          <Image
            src="/icons/tasks.svg"
            alt="담당업무"
            width={24}
            height={24}
            className="inline-block"
          />
          <span>{tasks || '담당업무'}</span>
        </div>

        {children}
      </div>
    </div>
  );
}
