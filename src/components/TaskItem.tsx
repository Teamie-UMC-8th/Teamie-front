'use client';

import { formatDate } from '@/utils/formatDate';
import { useTaskItems } from '@/features/boards/hooks/useTaskItems';
import { TaskItemComponentProps, TASK_STATUS_STYLES } from '@/types/api/tasks';
import Link from 'next/link';

export default function TaskItem({
  projectId,
  id: taskId,
  title,
  status,
  deadline,
  assignee,
}: TaskItemComponentProps) {
  const { displayAssignees, cardHeight, deadlineTextColor } = useTaskItems({
    task: { id: taskId, title, status, deadline, assignee },
  });

  // 상태별 스타일 가져오기 (타입 안전성 보장)
  const statusStyle = TASK_STATUS_STYLES[status] || TASK_STATUS_STYLES['시작 전'];

  return (
    <Link
      href={`/projects/${projectId}/tasks/${taskId}`}
      className={`block w-[325px] ${cardHeight}`}
    >
      <div className="bg-white w-full h-full rounded-[8px] border border-[#BBBBBB] p-4 flex items-start gap-3">
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
          {/* 업무명 (필수) */}
          <div className="font-normal text-[16px] text-black mt-[1px]">{title}</div>

          {/* 진행상태 (필수) */}
          <div className="flex items-center justify-between gap-[2px] text-[14px]">
            {/* 마감기한 (선택) */}
            {deadline ? (
              <span className={deadlineTextColor}>{formatDate(deadline)}까지</span>
            ) : (
              <span className="text-[#898989]">마감일 없음</span>
            )}

            {/* 진행상태 배지 */}
            <div
              className={`flex items-center justify-center px-2 py-0.5 w-[63px] h-[22px] rounded-full font-semibold ${statusStyle.bg} ${statusStyle.text}`}
            >
              {status}
            </div>
          </div>

          {/* 담당자 (선택) */}
          {displayAssignees && (
            <div className="mt-auto flex flex-wrap gap-2">
              {displayAssignees.displayList.map((name, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-[4px] rounded-[30px] p-[3px] pr-[9px]"
                  style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.25)' }}
                >
                  <img
                    src="/icons/assignee.svg"
                    alt="참석자 아이콘"
                    className="w-[16px] h-[16px]"
                  />
                  <span className="text-[12px]">{name}</span>
                </div>
              ))}
              {displayAssignees.hasMore && (
                <div className="inline-flex items-center rounded-[30px] p-[3px] pr-[9px] text-[12px] text-[#898989]">
                  ...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
