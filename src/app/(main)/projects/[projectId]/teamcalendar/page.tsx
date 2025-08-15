'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomDateCellWrapper from '@/features/teamclendar/CustomDateCellWrapper';
import axiosInstance from '@/lib/axiosInstance';
import CalendarEventBox from '@/features/teamclendar/components/CalendarEventBox';
import { useGetCalendarPlans } from '@/hooks/queries/useGetTeamCalendar';
import { useGetDashboard } from '@/hooks/queries/useGetDashboard';
import { useWebSocket } from '@/contexts/WebSocketContext';
import Image from 'next/image';
import {
  SubEventType,
  type WebSocketResponseUnion,
  isTaskResponse,
  isPlanResponse,
} from '@/types/webSocket';

const localizer = momentLocalizer(moment);

type CalendarEventType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projectCreatedAtISO, setProjectCreatedAtISO] = useState<string | undefined>(undefined);
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId?.toString();
  const projectIdNum = projectId ? Number(projectId) : undefined;
  const queryClient = useQueryClient();
  const { socket, subscribe, unsubscribe, isConnected } = useWebSocket();

  // 현재 보고 있는 달의 첫 날 ~ 마지막 날 계산
  const startDate = useMemo(
    () => moment(currentDate).startOf('month').toISOString(),
    [currentDate]
  );
  const endDate = useMemo(() => moment(currentDate).endOf('month').toISOString(), [currentDate]);

  // API 요청: 일정 목록
  const {
    data: calendarData,
    isLoading,
    refetch, // ✅ refetch 포함
  } = useGetCalendarPlans(projectId ?? '', startDate, endDate);

  // 대시보드(업무) 데이터도 함께 조회하여 캘린더에 표시
  const projectIdForDashboard = projectIdNum ?? 0;
  const { data: dashboardData } = useGetDashboard({
    projectId: projectIdForDashboard,
    view: 'status',
  });

  // 웹소켓 이벤트 처리 (팀 캘린더)
  useEffect(() => {
    if (isConnected && socket && projectId && projectIdNum) {
      // 1) project:calender 룸 구독
      subscribe(SubEventType.PROJECT_CALENDER, projectIdNum);

      // 2) publish 이벤트 수신 - 실시간 업데이트 처리
      const handlePublish = (data: WebSocketResponseUnion) => {
        console.log('팀캘린더 웹소켓 이벤트 수신:', data);

        // 일정(Plan) 생성/삭제/수정 -> 현재 월 범위의 캘린더 쿼리 무효화
        if (isPlanResponse(data)) {
          queryClient.invalidateQueries({
            queryKey: ['calendarPlans', projectId, startDate, endDate],
          });
        }

        // 업무(Task) 삭제 및 이름/마감일 수정 -> 대시보드(상태 뷰) 쿼리 무효화
        if (isTaskResponse(data)) {
          queryClient.invalidateQueries({
            queryKey: ['dashboard', projectIdNum, 'status'],
          });
        }
      };

      // 3) 강제 구독 해제 시 이동
      const handleForceUnsubscribe = () => {
        console.log('팀캘린더 강제 구독 해제');
        window.location.href = '/home/tasks';
      };

      socket.on('publish', handlePublish);
      socket.on('unsubscribe-forced', handleForceUnsubscribe);

      return () => {
        unsubscribe(SubEventType.PROJECT_CALENDER, projectIdNum);
        socket.off('publish', handlePublish);
        socket.off('unsubscribe-forced', handleForceUnsubscribe);
      };
    }
  }, [
    isConnected,
    socket,
    projectId,
    projectIdNum,
    subscribe,
    unsubscribe,
    queryClient,
    startDate,
    endDate,
  ]);

  // ✅ 창이 다시 focus될 때 refetch 실행
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]);

  // 프로젝트 생성일을 조회해 해당 일 이전 날짜 차단
  useEffect(() => {
    const fetchProjectMeta = async () => {
      try {
        if (!projectId) return;
        const { data } = await axiosInstance.get(`/api/v1/projects/${projectId}`);
        const createdAt = data?.result?.project?.createdAt || data?.result?.createdAt;
        if (createdAt) {
          // 날짜 비교 오차 방지를 위해 'YYYY-MM-DD'로 전달 (타임존 영향 제거)
          const creationDay = moment(createdAt).format('YYYY-MM-DD');
          setProjectCreatedAtISO(creationDay);
        }
      } catch {
        // 생성일을 못 가져오면 제한 없이 동작
        setProjectCreatedAtISO(undefined);
      }
    };
    fetchProjectMeta();
  }, [projectId]);

  // Calendar 표시용 events 가공 (timezone-safe)
  type RawPlan = {
    planId?: number | string;
    id?: number | string;
    scheduleId?: number | string;
    startDate?: string;
    endDate?: string;
    name?: string;
    title?: string;
    date?: string;
    startHour?: string;
    endHour?: string;
  };

  const planEvents: CalendarEventType[] = useMemo(() => {
    return (
      calendarData?.result.flatMap((entry) =>
        (entry.list ?? []).flatMap((plan) => {
          const rawPlan = plan as RawPlan;
          const rawId = rawPlan?.planId ?? rawPlan?.id ?? rawPlan?.scheduleId;
          if (!rawId) return [] as CalendarEventType[];

          // 1) startDate/endDate가 있으면 그대로 사용
          if (rawPlan.startDate || rawPlan.endDate) {
            const start = rawPlan.startDate ? new Date(rawPlan.startDate) : new Date();
            const end = rawPlan.endDate
              ? new Date(rawPlan.endDate)
              : new Date(new Date(start).getTime() + 60 * 1000);
            return [
              {
                id: String(rawId),
                title: rawPlan.name || rawPlan.title || '빈 일정',
                start,
                end,
              },
            ];
          }

          // 2) date만 있는 경우: 'YYYY-MM-DD' 또는 'YYYY-MM-DDTHH:mm:ss'
          const dateStr: string | undefined = rawPlan.date || entry.date;
          let start: Date;
          let end: Date;

          if (dateStr) {
            const m = dateStr.match(
              /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/
            );
            if (m) {
              const year = Number(m[1]);
              const monthIdx = Number(m[2]) - 1; // 0-based
              const day = Number(m[3]);
              const hour = rawPlan.startHour
                ? Number(rawPlan.startHour.split(':')[0])
                : m[4]
                  ? Number(m[4])
                  : 0;
              const minute = rawPlan.startHour
                ? Number(rawPlan.startHour.split(':')[1])
                : m[5]
                  ? Number(m[5])
                  : 0;
              const second = m[6] ? Number(m[6]) : 0;
              start = new Date(year, monthIdx, day, hour, minute, second);

              if (rawPlan.endHour) {
                const [eh, em] = String(rawPlan.endHour).split(':');
                end = new Date(year, monthIdx, day, Number(eh), Number(em) || 0, 0);
              } else {
                end = new Date(start.getTime() + 60 * 1000);
              }
            } else {
              start = new Date();
              end = new Date(start.getTime() + 60 * 1000);
            }
          } else {
            start = new Date();
            end = new Date(start.getTime() + 60 * 1000);
          }

          const isAllDay = !rawPlan.startHour && !rawPlan.endHour;
          return [
            {
              id: String(rawId),
              title: rawPlan.name || rawPlan.title || '빈 일정',
              start,
              end,
              ...(isAllDay ? { allDay: true } : {}),
            },
          ];
        })
      ) || []
    );
  }, [calendarData]);

  // 업무 대시보드 -> 캘린더 이벤트 변환 (마감일 기준, 해당 월 범위만)
  type DashboardTask = { taskId: number; taskName: string; deadline?: string | null };
  type DashboardGroup = { tasks?: DashboardTask[] };
  type DashboardDataWithStatusGroups = { statusGroups?: DashboardGroup[] };
  type DashboardDataWithSteps = { steps?: DashboardGroup[] };

  const dashboardEvents: CalendarEventType[] = useMemo(() => {
    if (!dashboardData) return [];
    const startM = moment(startDate);
    const endM = moment(endDate);

    // statusGroups 또는 steps 중 존재하는 구조에서 tasks를 추출
    const ds = dashboardData as unknown;
    const withStatus = (ds as DashboardDataWithStatusGroups).statusGroups;
    const withSteps = (ds as DashboardDataWithSteps).steps;
    const tasks: DashboardTask[] = withStatus
      ? (withStatus ?? []).flatMap((g) => g.tasks ?? [])
      : withSteps
        ? (withSteps ?? []).flatMap((s) => s.tasks ?? [])
        : [];

    return tasks
      .filter((t) => !!t?.deadline)
      .map((t) => ({
        id: `task:${String(t.taskId)}`,
        title: `${t.taskName} 마감`,
        start: new Date(t.deadline as string),
        end: new Date(new Date(t.deadline as string).getTime() + 60 * 1000),
        allDay: true,
      }))
      .filter((ev: CalendarEventType) => {
        const m = moment(ev.start);
        return m.isSameOrAfter(startM, 'day') && m.isSameOrBefore(endM, 'day');
      });
  }, [dashboardData, startDate, endDate]);

  const events: CalendarEventType[] = useMemo(
    () => [...planEvents, ...dashboardEvents],
    [planEvents, dashboardEvents]
  );

  // events 변경 시 콘솔 출력 (일정 자동 반영 확인용)
  useEffect(() => {
    console.log('일정 반영 확인:', events);
  }, [events]);

  const handleEventClick = (event: { id?: string; title?: string }) => {
    if (!event?.id || !projectId) {
      console.warn('onSelectEvent: 유효하지 않은 이벤트 또는 projectId 누락', { projectId, event });
      return;
    }
    const target = `/projects/${projectId}/teamcalendar/${event.id}/teamtask`;
    console.log('onSelectEvent: 팀태스크로 이동', {
      projectId,
      planId: event.id,
      title: event.title,
      target,
    });
    router.push(target);
  };

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month').toDate());
  };

  const formattedTitle = moment(currentDate).format('YYYY년 M월');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg">
        일정 불러오는 중...
      </div>
    );
  }

  return (
    <div>
      {/* 제목 */}
      <div className="w-full lg:max-w-[1415px] flex flex-col">
        <h2
          className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
        max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0]"
        >
          팀 캘린더
        </h2>
        <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[44px]" />
      </div>

      {/* 월 네비게이션 */}
      <div className="flex justify-start items-center font-semibold text-[20px] leading-[29px] text-black mb-[47px]">
        <button onClick={handlePrevMonth}>
          <Image
            src="/icons/Vector-left.svg"
            alt="왼쪽"
            width={24}
            height={24}
            className="w-[24px] h-[24px] cursor-pointer"
          />
        </button>
        <span className="mx-4">{formattedTitle}</span>
        <button onClick={handleNextMonth}>
          <Image
            src="/icons/Vector-right.svg"
            alt="오른쪽"
            width={24}
            height={24}
            className="w-[24px] h-[24px] cursor-pointer"
          />
        </button>
        <div className="ml-auto"></div>
      </div>

      {/* 캘린더 */}
      <BigCalendar
        onSelectEvent={handleEventClick}
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH]}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={() => {}} // 기본 이동 비활성화 (커스텀 버튼 사용 중)
        style={{ height: 'calc(100vh - 300px)', backgroundColor: 'white' }}
        components={{
          dateCellWrapper: (props) => (
            <CustomDateCellWrapper
              {...props}
              projectId={projectId}
              startDate={startDate}
              endDate={endDate}
              setCurrentDate={setCurrentDate}
              projectCreatedAtISO={projectCreatedAtISO}
            />
          ),
          event: (props) => (
            <div className="relative z-[60] pointer-events-auto">
              <CalendarEventBox {...props} />
            </div>
          ), // ✅ 커스텀 일정 카드 디자인 - 클릭 가능 보장
        }}
        eventPropGetter={(event) => {
          const idValue = (event as { id?: unknown }).id;
          const idStr =
            typeof idValue === 'string' ? idValue : idValue != null ? String(idValue) : '';
          const isTask = idStr.startsWith('task:');
          const bg = isTask ? '#DAF3F3' : '#B6F5DF';
          return {
            style: {
              backgroundColor: bg,
              border: 'none',
              color: '#000000',
              borderRadius: '4px',
              position: 'relative',
              zIndex: 60,
            },
          };
        }}
        popup
        toolbar={false}
      />
    </div>
  );
}
