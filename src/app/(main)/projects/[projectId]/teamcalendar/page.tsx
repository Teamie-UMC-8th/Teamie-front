"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import moment from "moment";
import CalendarButton from "@/features/teamclendar/CalendarButton";
import CustomDateCellWrapper from "@/features/teamclendar/CustomDateCellWrapper";
import { useParams } from "next/navigation";
import CustomEvent from "@/features/teamclendar/CustomEvent";

const localizer = momentLocalizer(moment);

// ✅ 이벤트 타입 정의
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const DnDCalendar = withDragAndDrop<CalendarEvent>(BigCalendar);

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "정기 회의",
      start: new Date(2025, 7, 30, 10, 0),
      end: new Date(2025, 7, 30, 11, 0),
    },
    {
      id: "2",
      title: "UMC 8기 프로젝트 TEAMIE 킥오프 회의",
      start: new Date(2025, 7, 1, 10, 0),
      end: new Date(2025, 7, 1, 11, 0),
    },
  ]);

  const params = useParams();
  const projectId = params.projectId?.toString();

  const handlePrevMonth = () => {
    const newDate = moment(currentDate).subtract(1, "month").toDate();
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = moment(currentDate).add(1, "month").toDate();
    setCurrentDate(newDate);
  };

  // ✅ 오류 없는 드래그 핸들러
  const handleEventDrop = ({
    event,
    start,
    end,
  }: {
    event: CalendarEvent;
    start: Date | string;
    end: Date | string;
  }) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id
        ? {
            ...e,
            start: new Date(start),
            end: new Date(end),
          }
        : e
    );
    setEvents(updatedEvents);
  };

  const formattedTitle = moment(currentDate).format("YYYY년 M월");

  return (
    <div>
      {/* 제목 */}
      <div className="w-full lg:max-w-[1415px] flex flex-col">
        <h2 className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
        max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0]">
          팀 캘린더
        </h2>
        <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[44px]" />
      </div>

      {/* 월 네비게이션 */}
      <div className="flex justify-start items-center font-semibold text-[20px] leading-[29px] text-black mb-[47px]">
        <button onClick={handlePrevMonth}>
          <img src="/icons/Vector-left.svg" alt="왼쪽" className="w-[24px] h-[24px] cursor-pointer" />
        </button>
        <span className="mx-4">{formattedTitle}</span>
        <button onClick={handleNextMonth}>
          <img src="/icons/Vector-right.svg" alt="오른쪽" className="w-[24px] h-[24px] cursor-pointer" />
        </button>
        <div className="ml-auto">
          <CalendarButton />
        </div>
      </div>

      {/* 캘린더 */}
      <DnDCalendar
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH]}
        startAccessor={(event) => event.start}
        endAccessor={(event) => event.end}
        date={currentDate}
        onNavigate={() => {}}
        style={{ height: "calc(100vh - 300px)", backgroundColor: "white" }}
        components={{
          dateCellWrapper: (props) => (
            <CustomDateCellWrapper {...props} projectId={projectId} />
          ),
        }}
        draggableAccessor={() => true}
        onEventDrop={handleEventDrop}
        popup
        toolbar={false}
        eventPropGetter={(event) => {
          let backgroundColor = "#B6F5DF";
          if (event.title === "업무 A 0차 마감") {
            backgroundColor = "#DAF3F3";
          }

          return {
            style: {
              backgroundColor,
              borderRadius: "4px",
              padding: "4px 22px",
              color: "#000000",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              fontFamily: "Pretendard, sans-serif",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
              textAlign: "center",
            },
          };
        }}
      />
    </div>
  );
}
