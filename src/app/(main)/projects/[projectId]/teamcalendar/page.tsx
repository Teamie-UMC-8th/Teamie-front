'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CalendarButton from '@/features/teamclendar/CalendarButton';
import CustomDateCellWrapper from '@/features/teamclendar/CustomDateCellWrapper';
import { useGetCalendarPlans } from '@/hooks/queries/useGetTeamCalendar';

const localizer = momentLocalizer(moment);

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId?.toString();

  //  현재 보고 있는 달의 첫 날 ~ 마지막 날 계산
  const startDate = useMemo(
    () => moment(currentDate).startOf('month').toISOString(),
    [currentDate]
  );
  const endDate = useMemo(() => moment(currentDate).endOf('month').toISOString(), [currentDate]);

  //  API 요청: startDate, endDate 추가
  const { data: calendarData, isLoading } = useGetCalendarPlans(
    projectId ?? '',
    startDate,
    endDate
  );

  const events =
    calendarData?.result.flatMap((entry) =>
      (entry.list ?? []).map((plan) => ({
        id: String(plan.planId),
        title: plan.title,
        start: new Date(plan.startDate),
        end: new Date(plan.endDate),
      }))
    ) || [];

  const handleEventClick = (event: any) => {
    router.push(`/projects/${projectId}/teamcalendar/${event.id}/teamtask`);
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
        <div className="ml-auto">
          <CalendarButton />
        </div>
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
        onNavigate={() => {}}
        style={{ height: 'calc(100vh - 300px)', backgroundColor: 'white' }}
        components={{
          dateCellWrapper: (props) => (
            <CustomDateCellWrapper
              {...props}
              projectId={projectId}
              startDate={startDate}
              endDate={endDate}
              currentDate={currentDate}
            />
          ),
        }}
        popup
        toolbar={false}
      />
    </div>
  );
}
