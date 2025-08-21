'use client';

import { ReactNode, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePostPlan } from '@/hooks/mutations/usePostTeamCalendar';
import { usePatchPlan } from '@/hooks/mutations/usePlan';
import moment from 'moment';
import { checkTaskDetail, updateTaskDetail } from '@/services/taskDetail/checkTaskDetail';

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
  isProjectCompleted?: boolean; // 프로젝트 종료 여부
}

export default function CustomDateCellWrapper({
  children,
  value,
  projectId,
  startDate,
  endDate,
  setCurrentDate,
  projectCreatedAtISO,
  isProjectCompleted = false,
}: CustomDateCellWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = usePostPlan();
  const { mutate: patchPlan } = usePatchPlan();

  // 프로젝트 생성일 이전인지 확인
  const isBeforeProjectCreation = projectCreatedAtISO
    ? moment(value).isBefore(moment(projectCreatedAtISO), 'day')
    : false;

  // 플러스 버튼 표시 조건: 프로젝트 생성일 이후만, 그리고 프로젝트가 종료되지 않았을 때
  const canShowPlusButton = !isBeforeProjectCreation && !isProjectCompleted;

  const handleClick = () => {
    if (!projectId || !canShowPlusButton) return;

    // 선택한 날짜 + 현재 시간으로 조합
    const selectedDate = moment(value);
    const currentTime = moment();

    const formattedDate = selectedDate
      .hour(currentTime.hour())
      .minute(currentTime.minute())
      .second(currentTime.second())
      .millisecond(currentTime.millisecond())
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    console.log('플러스 버튼 클릭!', {
      projectId,
      formattedDate,
      selectedDate: selectedDate.format('YYYY-MM-DD'),
      currentTime: currentTime.format('HH:mm:ss'),
    });

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

          router.push(`/projects/${projectId}/teamCalendar/${planId}/teamTask`);
          console.log(
            '상세 페이지로 이동:',
            `/projects/${projectId}/teamCalendar/${planId}/teamTask`
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
  const indicatorVisible = isDragOver; // 호버 상태와 독립적으로 작동

  // 드롭할 목표 날짜 문자열 (선택한 날짜 + 현재 시간으로 조합)
  const dropTargetDate = useMemo(() => {
    const selectedDate = moment(value);
    const currentTime = moment();

    return selectedDate
      .hour(currentTime.hour())
      .minute(currentTime.minute())
      .second(currentTime.second())
      .millisecond(currentTime.millisecond())
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  }, [value]);

  return (
    <div
      className={`relative w-full h-full transition-all duration-200 rounded-[4px] overflow-visible ${hoverActive ? 'shadow-[0_0_10px_rgba(0,0,0,0.25)] cursor-pointer z-[90px]' : ''}`}
      onMouseEnter={() => {
        if (canShowPlusButton) setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onDragEnter={(e) => {
        // 외부에서 넘어온 일정/업무 허용
        const hasData =
          e.dataTransfer.types.includes('application/x-teamie-plan') ||
          e.dataTransfer.types.includes('application/x-teamie-task') ||
          e.dataTransfer.types.includes('text/plain');
        if (hasData) {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          let y = e.clientY - rect.top;
          // 셀 경계를 넘어서는 드롭 허용 (확장된 드롭 영역)
          y = Math.max(-20, Math.min(y, rect.height + 20));
          setIndicatorY(y);
          setIsDragOver(true);
        }
      }}
      onDragOver={(e) => {
        const hasData =
          e.dataTransfer.types.includes('application/x-teamie-plan') ||
          e.dataTransfer.types.includes('application/x-teamie-task') ||
          e.dataTransfer.types.includes('text/plain');
        if (hasData) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          let y = e.clientY - rect.top;
          // 셀 경계를 넘어서는 드롭 허용 (확장된 드롭 영역)
          y = Math.max(-20, Math.min(y, rect.height + 20));
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
          const planRaw = e.dataTransfer.getData('application/x-teamie-plan');
          const taskRaw = e.dataTransfer.getData('application/x-teamie-task');
          const textRaw = e.dataTransfer.getData('text/plain');

          if (planRaw) {
            const parsed = JSON.parse(planRaw);
            const planId: string | undefined = parsed?.planId;
            if (!planId) return;
            // 일정 날짜만 변경
            patchPlan(
              { planId, planData: { date: dropTargetDate } },
              {
                onSuccess: () => {
                  if (projectId) {
                    queryClient.invalidateQueries({
                      queryKey: ['calendarPlans', projectId, startDate, endDate],
                    });
                  }
                },
              }
            );
            return;
          }

          if (taskRaw || textRaw) {
            const raw = taskRaw || textRaw;
            const parsed = raw ? JSON.parse(raw) : null;
            const taskIdStr: string | undefined = parsed?.taskId;
            const taskId = taskIdStr ? Number(taskIdStr) : undefined;
            if (!taskId) return;

            // 업무 마감일을 YYYY-MM-DD 23:59:59로 설정
            const m = moment(dropTargetDate);
            const formattedDeadline = `${m.format('YYYY-MM-DD')} 23:59:59`;

            (async () => {
              try {
                const detail = await checkTaskDetail(taskId);
                if (!detail?.result) return;

                // 기존 값 유지 + 마감일만 변경
                await updateTaskDetail(taskId, {
                  name: detail.result.name,
                  deadline: formattedDeadline,
                  status: detail.result.status,
                  memo: detail.result.memo,
                  managerIds: detail.result.managers.map((m) => m.userId),
                  existingFileUrls: detail.result.files?.map((f) => f.fileUrl) ?? [],
                  stepId: detail.result.stepId,
                });

                if (projectId) {
                  queryClient.invalidateQueries({
                    queryKey: ['dashboard', Number(projectId), 'status'],
                  });
                }
              } catch (err: unknown) {
                console.error('업무 마감일 업데이트 실패:', err);
                if (projectId) {
                  queryClient.invalidateQueries({
                    queryKey: ['dashboard', Number(projectId), 'status'],
                  });
                }
              }
            })();
          }
        } catch {
          // 파싱 실패 시 무시
        }
      }}
    >
      {children}
      {/* 드래그 오버 라인 인디케이터 */}
      {indicatorVisible && (
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            top: indicatorY,
            height: '3px',
            borderRadius: '10px',
            backgroundColor: '#81D7D4',
            boxShadow: '0 0 4px #81D7D4',
          }}
        />
      )}
      {/* 플러스 버튼 - 가벼운 호버 센서 사용: 캘린더 이벤트 클릭을 막지 않음 */}
      {canShowPlusButton && (
        <div className="absolute top-0 right-0 z-[90] w-[40px] h-[40px] pointer-events-auto">
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
                <Image src="/icons/AddProject.svg" alt="일정 추가" width={24} height={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
