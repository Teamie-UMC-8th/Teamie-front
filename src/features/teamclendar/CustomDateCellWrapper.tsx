'use client';

import { ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePostPlan } from '@/hooks/mutations/usePostTeamCalendar';
import { usePatchPlan } from '@/hooks/mutations/usePlan';
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
  projectCreatedAtISO?: string; // 프로젝트 생성일 (이전 날짜에는 추가/호버 비활성화)
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
  projectCreatedAtISO,
}: CustomDateCellWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = usePostPlan();
  const { mutate: patchPlan } = usePatchPlan();

  // 오늘 날짜 이후인지 확인 (오늘 포함)
  const isTodayOrAfter = moment(value).isSameOrAfter(moment(), 'day');

  // 프로젝트 생성일 이전인지 확인
  const isBeforeProjectCreation = projectCreatedAtISO
    ? moment(value).isBefore(moment(projectCreatedAtISO), 'day')
    : false;

  // 플러스 버튼 표시 조건: 오늘 이후이면서, 프로젝트 생성일 이후만
  const canShowPlusButton = isTodayOrAfter && !isBeforeProjectCreation;

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

  const hoverActive = hovered && canShowPlusButton;

  // 드래그 앤 드롭: 드래그 진입 시 상단 라인 인디케이터 표시
  const [isDragOver, setIsDragOver] = useState(false);
  const [indicatorY, setIndicatorY] = useState<number>(4);
  const indicatorVisible = isDragOver && canShowPlusButton;

  // 드롭할 목표 날짜 문자열 (로컬 자정)
  const dropTargetDate = useMemo(() => moment(value).format('YYYY-MM-DD[T]00:00:00'), [value]);

  return (
    <div
      className={`relative w-full h-full transition-all duration-200 rounded-[4px] overflow-visible ${hoverActive ? 'shadow-[0_0_10px_rgba(0,0,0,0.25)] cursor-pointer' : ''}`}
      onMouseEnter={() => {
        if (canShowPlusButton) setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onDragEnter={(e) => {
        // 외부에서 넘어온 일정만 허용
        const hasData =
          e.dataTransfer.types.includes('application/x-teamie-plan') ||
          e.dataTransfer.types.includes('text/plain');
        if (hasData && canShowPlusButton) {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const y = Math.max(8, Math.min(e.clientY - rect.top, rect.height - 8));
          setIndicatorY(y);
          setIsDragOver(true);
        }
      }}
      onDragOver={(e) => {
        const hasData =
          e.dataTransfer.types.includes('application/x-teamie-plan') ||
          e.dataTransfer.types.includes('text/plain');
        if (hasData && canShowPlusButton) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const y = Math.max(8, Math.min(e.clientY - rect.top, rect.height - 8));
          setIndicatorY(y);
          setIsDragOver(true);
        }
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!canShowPlusButton) return;
        try {
          const raw =
            e.dataTransfer.getData('application/x-teamie-plan') ||
            e.dataTransfer.getData('text/plain');
          const parsed = raw ? JSON.parse(raw) : null;
          const planId: string | undefined = parsed?.planId;
          if (!planId) return;

          // 일정 날짜만 변경
          patchPlan(
            { planId, planData: { date: dropTargetDate } },
            {
              onSuccess: () => {
                // 현재 월 범위 일정 목록 새로고침
                if (projectId) {
                  queryClient.invalidateQueries({
                    queryKey: ['calendarPlans', projectId, startDate, endDate],
                  });
                }
              },
            }
          );
        } catch {
          // 파싱 실패 시 무시
        }
      }}
    >
      {children}
      {/* 드래그 오버 라인 인디케이터 */}
      {indicatorVisible && (
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            top: indicatorY,
            width: '100%',
            height: '3px',
            borderRadius: '10px',
            backgroundColor: '#81D7D4',
            boxShadow: '0 0 4px #81D7D4',
          }}
        />
      )}
      {/* 플러스 버튼 - 가벼운 호버 센서 사용: 캘린더 이벤트 클릭을 막지 않음 */}
      {canShowPlusButton && (
        <div className="absolute top-0 right-0 z-[70] w-[40px] h-[40px] pointer-events-auto">
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
        </div>
      )}
    </div>
  );
}
