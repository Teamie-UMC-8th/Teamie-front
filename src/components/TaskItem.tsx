'use client';

import { formatDate } from '@/utils/formatDate';

interface TaskItemProps {
  title: string;
  status: '시작 전' | '진행 중' | '완료';
  deadline: string;
  assignee?: string[];
}

export default function TaskItem({ title, status, deadline, assignee }: TaskItemProps) {
  return (
    <div className="bg-white w-[325px] h-[122px] rounded-[8px] border border-[#BBBBBB] p-4 flex items-start gap-3">
      <label className="inline-flex items-center flex-shrink-0 mt-1">
        <input
          type="checkbox"
          className="peer appearance-none w-[20px] h-[20px] border-2 border-[#898989] rounded bg-white checked:bg-[#81D7D4]"
        />
        <svg
          className="hidden peer-checked:block -ml-5 pointer-events-none"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth="3"
          fill="none"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </label>

      <div className="flex flex-col flex-1 gap-[10px]">
        <div className="font-normal text-[16px] text-black mt-[1px]">{title}</div>

        <div className="flex items-center justify-between gap-[2px] text-[14px] text-[#898989]">
          {formatDate(deadline) === '마감일 없음' ? (
            <span>마감일 없음</span>
          ) : (
            <span>{formatDate(deadline)}까지</span>
          )}
          <div
            className={`flex items-center justify-center px-2 py-0.5 w-[63px] h-[22px] rounded-full font-semibold ${
              status === '진행 중'
                ? 'bg-[#B6F5DF] text-[#505050]'
                : status === '완료'
                  ? 'bg-[#D1D5DB] text-[#505050]'
                  : 'bg-[#E7E7E7] text-[#505050]'
            }`}
          >
            {status}
          </div>
        </div>

        {assignee && assignee.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {assignee.map((name, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-[4px] rounded-[30px] p-[3px] pr-[9px]"
                style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.25)' }}
              >
                <img src="/icons/assignee.svg" alt="참석자 아이콘" className="w-[16px] h-[16px]" />
                <span className="text-[12px]">{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
