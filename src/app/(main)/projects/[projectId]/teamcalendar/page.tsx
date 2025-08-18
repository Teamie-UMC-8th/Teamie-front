'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomDateCellWrapper from '@/features/teamCalendar/CustomDateCellWrapper';
import axiosInstance from '@/lib/axiosInstance';
import CalendarEventBox from '@/features/teamCalendar/components/CalendarEventBox';
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
  // 현재 날짜를 split으로 생성 (YYYY-MM-DD 형식)
  const now = new Date();
  const [year, month, day] = [now.getFullYear(), now.getMonth(), now.getDate()];
  const [currentDate, setCurrentDate] = useState(new Date(year, month, day));
  const [projectCreatedAtISO, setProjectCreatedAtISO] = useState<string | undefined>(undefined);
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId?.toString();
  const projectIdNum = projectId ? Number(projectId) : undefined;
  const queryClient = useQueryClient();
  const { socket, subscribe, unsubscribe, isConnected } = useWebSocket();

  // 현재 월 + 이전/다음 월 일부 포함하여 조회 (45일 범위로 확장)
  const startDate = useMemo(
    () => moment(currentDate).subtract(22, 'days').startOf('day').toISOString(),
    [currentDate]
  );
  const endDate = useMemo(
    () => moment(currentDate).add(22, 'days').endOf('day').toISOString(),
    [currentDate]
  );

  // API 요청: 일정 목록
  const { data: calendarData, isLoading } = useGetCalendarPlans(
    projectId ?? '',
    startDate,
    endDate
  );

  console.log('calendarData', calendarData);

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

  // 창 포커스 refetch 제거
  // useEffect(() => {
  //   const handleFocus = () => {
  //     refetch();
  //   };
  //   window.addEventListener('focus', handleFocus);
  //   return () => {
  //     window.removeEventListener('focus', handleFocus);
  //   };
  // }, [refetch]);

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

  // Calendar 표시용 events 가공 (간단하게)
  type RawPlan = {
    planId?: number | string;
    id?: number | string;
    scheduleId?: number | string;
    name?: string;
    title?: string;
    date?: string;
  };

  const planEvents: CalendarEventType[] = useMemo(() => {
    return (
      calendarData?.result.flatMap((entry) =>
        // 먼저 PLAN 타입만 남기기
        (entry.list ?? [])
          .filter((plan) => (plan as { type?: string }).type === 'PLAN')
          .flatMap((plan) => {
            const rawPlan = plan as RawPlan;
            const rawId = rawPlan?.planId ?? rawPlan?.id ?? rawPlan?.scheduleId;
            if (!rawId) return [] as CalendarEventType[];

            // 백엔드에서 받은 date를 그대로 사용 (변환하지 않음)
            const dateStr: string | undefined = rawPlan.date || entry.date;
            if (dateStr) {
              // ✅ moment.js를 사용해 날짜 문자열을 로컬 시간대 자정으로 정확히 변환
              const eventDate = moment(dateStr, 'YYYY-MM-DD');

              return [
                {
                  id: String(rawId),
                  title: rawPlan.name || rawPlan.title || '빈 일정',
                  start: eventDate.toDate(), // Date 객체로 변환하여 전달
                  end: eventDate.toDate(), // allDay 이벤트는 start와 end가 같아도 됨
                  allDay: true, // 하루 종일 이벤트로 설정
                },
              ];
            }

            return [];
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
      .map((t) => {
        const deadlineStr = t.deadline as string;

        // ✅ moment.js를 사용해 날짜 문자열을 로컬 시간대 자정으로 정확히 변환
        const eventDate = moment(deadlineStr, 'YYYY-MM-DD');

        return {
          id: `task:${String(t.taskId)}`,
          title: `${t.taskName} 마감`,
          start: eventDate.toDate(), // Date 객체로 변환하여 전달
          end: eventDate.toDate(), // allDay 이벤트는 start와 end가 같아도 됨
          allDay: true, // 하루 종일 이벤트로 설정
        };
      })
      .filter((ev: CalendarEventType) => {
        // ✅ moment.js를 사용한 안정적이고 간결한 날짜 비교
        const eventMoment = moment(ev.start);
        return eventMoment.isSameOrAfter(startM, 'day') && eventMoment.isSameOrBefore(endM, 'day');
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
    const target = `/projects/${projectId}/teamCalendar/${event.id}/teamTask`;
    console.log('onSelectEvent: 팀태스크로 이동', {
      projectId,
      planId: event.id,
      title: event.title,
      target,
    });
    router.push(target);
  };

  const handlePrevMonth = () => {
    const [year, month, day] = [
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ];
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    setCurrentDate(new Date(prevYear, prevMonth, day));
  };

  const handleNextMonth = () => {
    const [year, month, day] = [
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ];
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    setCurrentDate(new Date(nextYear, nextMonth, day));
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
        <hr className=" w-[1500px] border-t-[2px] border-[#E7E7E7] rotate-180 mb-[44px] -ml-[10px]" />
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
        showAllEvents={true}
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
