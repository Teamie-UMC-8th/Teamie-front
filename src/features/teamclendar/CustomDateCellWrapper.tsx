'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePostPlan } from '@/hooks/mutations/usePostTeamCalendar';
import moment from 'moment';

interface CustomDateCellWrapperProps {
  children: ReactNode;
  value: Date;
  projectId: string | undefined;
  startDate: string;
  endDate: string;
  currentDate?: Date;
  latestPlanDate?: string; // 가장 최근 일정 날짜 추가
}

export default function CustomDateCellWrapper({
  children,
  value,
  projectId,
  startDate,
  endDate,
  currentDate = new Date(),
  latestPlanDate,
}: CustomDateCellWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = usePostPlan();

  // 현재 달의 날짜인지 확인
  const isCurrentMonth = moment(value).isSame(currentDate, 'month');

  // 오늘 날짜 이후인지 확인 (오늘 포함)
  const isTodayOrAfter = moment(value).isSameOrAfter(moment(), 'day');

  // 플러스 버튼을 표시할 수 있는지 확인 (모든 날짜에서 오늘 이후만)
  const canShowPlusButton = isTodayOrAfter;

  const handleClick = () => {
    if (!projectId || !canShowPlusButton) return;

    const formattedDate = new Date(value).toISOString();

    mutate(
      { projectId, date: formattedDate },
      {
        onSuccess: (data) => {
          const planId = data.result.planId;

          queryClient.invalidateQueries({
            queryKey: ['calendarPlans', projectId, startDate, endDate],
          });

          router.push(`/projects/${projectId}/teamcalendar/${planId}/teamtask`);
        },
      }
    );
  };

  return (
    <div
      className={`relative w-full h-full transition-all duration-200 rounded-[4px] z-[10] overflow-visible ${
        hovered && canShowPlusButton ? 'shadow-[0_0_10px_rgba(0,0,0,0.25)] cursor-pointer' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* 플러스 버튼 - 현재 달의 날짜이면서 최근 일정 이후 날짜에서만 표시 */}
      {canShowPlusButton && (
        <div
          className="absolute top-[8px] right-[8px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && (
            <button
              className="flex items-center justify-center rounded-[4px] cursor-pointer"
              onClick={handleClick}
            >
              <img src="/icons/AddProject.svg" alt="일정 추가" className="w-[24px] h-[24px]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
