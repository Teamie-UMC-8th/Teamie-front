'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomDateCellWrapper from '@/features/teamclendar/CustomDateCellWrapper';
import axiosInstance from '@/lib/axiosInstance';
import CalendarEventBox from '@/features/teamclendar/components/CalendarEventBox';
import { useGetCalendarPlans } from '@/hooks/queries/useGetTeamCalendar';

const localizer = momentLocalizer(moment);

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projectCreatedAtISO, setProjectCreatedAtISO] = useState<string | undefined>(undefined);
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId?.toString();

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
      } catch (e) {
        // 생성일을 못 가져오면 제한 없이 동작
        setProjectCreatedAtISO(undefined);
      }
    };
    fetchProjectMeta();
  }, [projectId]);

  // Calendar 표시용 events 가공 (timezone-safe)
  const events =
    calendarData?.result.flatMap((entry) =>
      (entry.list ?? []).map((plan) => {
        const anyPlan = plan as any;

        // 1) startDate/endDate가 있으면 그대로 사용
        if (anyPlan.startDate || anyPlan.endDate) {
          const start = anyPlan.startDate ? new Date(anyPlan.startDate) : new Date();
          const end = anyPlan.endDate
            ? new Date(anyPlan.endDate)
            : new Date(new Date(start).getTime() + 60 * 1000);
          return {
            id: String(anyPlan.planId),
            title: anyPlan.name || anyPlan.title || '빈 일정',
            start,
            end,
          };
        }

        // 2) date만 있는 경우: 'YYYY-MM-DD' 또는 'YYYY-MM-DDTHH:mm:ss'
        const dateStr: string | undefined = anyPlan.date || entry.date;
        let start: Date;
        let end: Date;

        if (dateStr) {
          // 안전 파싱: 문자열에서 연-월-일 및 선택적 시:분 추출 후 local Date 생성
          const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
          if (m) {
            const year = Number(m[1]);
            const monthIdx = Number(m[2]) - 1; // 0-based
            const day = Number(m[3]);
            const hour = anyPlan.startHour
              ? Number(anyPlan.startHour.split(':')[0])
              : m[4]
                ? Number(m[4])
                : 0;
            const minute = anyPlan.startHour
              ? Number(anyPlan.startHour.split(':')[1])
              : m[5]
                ? Number(m[5])
                : 0;
            const second = m[6] ? Number(m[6]) : 0;
            start = new Date(year, monthIdx, day, hour, minute, second);

            // 종료 시간: endHour 우선, 없으면 시작 + 1분
            if (anyPlan.endHour) {
              const [eh, em] = String(anyPlan.endHour).split(':');
              end = new Date(year, monthIdx, day, Number(eh), Number(em) || 0, 0);
            } else {
              end = new Date(start.getTime() + 60 * 1000);
            }
          } else {
            // 포맷 예측 실패 시 안전 fallback (0분 이벤트 방지: +1분)
            start = new Date();
            end = new Date(start.getTime() + 60 * 1000);
          }
        } else {
          // date가 전혀 없는 경우
          start = new Date();
          end = new Date(start.getTime() + 60 * 1000);
        }

        const isAllDay = !anyPlan.startHour && !anyPlan.endHour;
        return {
          id: String(anyPlan.planId),
          title: anyPlan.name || anyPlan.title || '빈 일정',
          start,
          end,
          ...(isAllDay ? { allDay: true } : {}),
        };
      })
    ) || [];

  // events 변경 시 콘솔 출력 (일정 자동 반영 확인용)
  useEffect(() => {
    console.log('일정 반영 확인:', events);
  }, [events]);

  const handleEventClick = (event: { id: string; title?: string }) => {
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
          <img
            src="/icons/Vector-left.svg"
            alt="왼쪽"
            className="w-[24px] h-[24px] cursor-pointer"
          />
        </button>
        <span className="mx-4">{formattedTitle}</span>
        <button onClick={handleNextMonth}>
          <img
            src="/icons/Vector-right.svg"
            alt="오른쪽"
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
          event: CalendarEventBox, // ✅ 커스텀 일정 카드 디자인
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#B6F5DF',
            border: 'none',
            color: '#000000',
            borderRadius: '4px',
          },
        })}
        popup
        toolbar={false}
      />
    </div>
  );
}
