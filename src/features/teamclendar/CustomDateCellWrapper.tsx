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
  setCurrentDate: (date: Date) => void;
  latestPlanDate?: string; // 가장 최근 일정 날짜 추가
}

export default function CustomDateCellWrapper({
  children,
  value,
  projectId,
  startDate,
  endDate,
  setCurrentDate,
  currentDate = new Date(),
  latestPlanDate,
}: CustomDateCellWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = usePostPlan();

  // 오늘 날짜 이후인지 확인 (오늘 포함)
  const isTodayOrAfter = moment(value).isSameOrAfter(moment(), 'day');

  // 플러스 버튼을 표시할 수 있는지 확인 (모든 날짜에서 오늘 이후만)
  const canShowPlusButton = isTodayOrAfter;

  const handleClick = () => {
    if (!projectId || !canShowPlusButton) return;

    // 로컬 자정 고정: YYYY-MM-DDT00:00:00 (타임존 시프트 방지)
    const formattedDate = moment(value).format('YYYY-MM-DD[T]00:00:00');

    console.log('플러스 버튼 클릭!', { projectId, formattedDate });

    mutate(
      { projectId, date: formattedDate },
      {
        onSuccess: (data) => {
          const planId = data.result.planId;
          console.log('일정 생성 성공!', data);

          setCurrentDate(new Date(value));

          // 현재 보이는 월의 리스트를 강제 갱신해 신규 일정이 즉시 렌더되도록 함
          queryClient.invalidateQueries({
            queryKey: ['calendarPlans', projectId, startDate, endDate],
          });
          console.log('일정 목록 refetch 요청!');

          router.push(`/projects/${projectId}/teamcalendar/${planId}/teamtask`);
          console.log(
            '상세 페이지로 이동:',
            `/projects/${projectId}/teamcalendar/${planId}/teamtask`
          );
        },
        onError: (error) => {
          console.error('일정 생성 실패', error);
        },
      }
    );
  };

  return (
    <div
      className={`relative w-full h-full transition-all duration-200 rounded-[4px] z-[10] overflow-visible ${hovered ? 'shadow-[0_0_10px_rgba(0,0,0,0.25)] cursor-pointer' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* 플러스 버튼 */}
      <div
        className="absolute top-[8px] right-[8px] z-[60]"
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
