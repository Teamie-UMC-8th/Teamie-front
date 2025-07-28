'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import Daypicker from '@/components/DayPicker';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// DragAndDrop 기능이 추가된 Calendar 컴포넌트
const DnDCalendar = withDragAndDrop(Calendar);

export default function TeamCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState(null);
  const router = useRouter();

  // 이벤트를 state로 관리
  const [events, setEvents] = useState([
    {
      id: 1,
      title: '프로젝트 회의',
      start: new Date(2025, 6, 30, 10, 0), // 2025년 7월 30일 10시
      end: new Date(2025, 6, 30, 11, 0),
    },
    {
      id: 2,
      title: '개발 마감',
      start: new Date(2025, 6, 30, 13, 0),
      end: new Date(2025, 6, 30, 14, 0),
    },
  ]);

  const handleDateClick = (date) => {
    console.log('Add project clicked for date:', date);
    router.push('/schedulePage'); //프로젝트 일정 페이지로 이동
  };

  // 드래그 시작 처리
  const onDragStart = ({ event }) => {
    console.log('Drag started:', event);
    setIsDragging(true);
  };

  // 드래그 앤 드롭으로 이벤트 이동 처리
  const onEventDrop = ({ event, start, end }) => {
    console.log('Event dropped:', { event, start, end });

    const updatedEvents = events.map((existingEvent) =>
      existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent
    );

    setEvents(updatedEvents);
    setIsDragging(false);

    // 여기서 서버에 업데이트 요청을 보낼 수 있습니다
    // await updateEventOnServer(event.id, { start, end });
  };

  // 이벤트 크기 조정 처리 (시작/종료 시간 변경)
  const onEventResize = ({ event, start, end }) => {
    console.log('Event resized:', { event, start, end });

    const updatedEvents = events.map((existingEvent) =>
      existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent
    );

    setEvents(updatedEvents);

    // 여기서 서버에 업데이트 요청을 보낼 수 있습니다
    // await updateEventOnServer(event.id, { start, end });
  };

  useEffect(() => {
    const addHoverButtons = () => {
      // 기존 버튼들 제거
      document.querySelectorAll('.custom-add-btn').forEach((btn) => btn.remove());

      // 모든 날짜 셀에 버튼 추가
      const dateCells = document.querySelectorAll('.rbc-date-cell');
      dateCells.forEach((cell, index) => {
        // 버튼 생성
        const button = document.createElement('button');
        button.className = 'custom-add-btn';
        button.style.cssText = `
          position: absolute;
          top: 12.25px;
          right: 12.25px;
          width: 24px;
          height: 24px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1000;
          pointer-events: auto;
        `;

        // 이미지 생성
        const img = document.createElement('img');
        img.src = '/icons/AddProject.svg';
        img.alt = 'Add Project';
        img.style.cssText = 'width: 100%; height: 100%;';

        button.appendChild(img);

        button.addEventListener('click', (e) => {
          e.stopPropagation();
          handleDateClick(new Date());
        });

        // hover 이벤트
        cell.addEventListener('mouseenter', () => {
          button.style.opacity = '0.8';
          button.style.visibility = 'visible';
        });

        cell.addEventListener('mouseleave', () => {
          button.style.opacity = '0';
          button.style.visibility = 'hidden';
        });

        // 버튼 hover 이벤트
        button.addEventListener('mouseenter', () => {
          button.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
          button.style.opacity = '0.8';
        });

        // 셀을 relative로 만들기
        cell.style.position = 'relative';
        cell.appendChild(button);
      });
    };

    // 캘린더가 렌더링된 후 실행
    const timer = setTimeout(addHoverButtons, 100);

    return () => clearTimeout(timer);
  }, [currentDate, events]);

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      {/* 전체 레이아웃 가운데 정렬 */}
      <div className="w-full max-w-7xl">
        <div className="w-full text-left">
          <h1 className="text-2xl font-bold mb-4">팀 캘린더</h1>
        </div>
        <hr className="w-full border-t mb-8" style={{ borderColor: '#E7E7E7' }} />

        {/* 화살표 + 월 표시 + 햄버거 버튼 */}
        <div className="flex items-center justify-between w-full mb-6">
          {/* 화살표와 월 표시 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="text-lg px-2 hover:text-blue-600"
            >
              ◀
            </button>
            <h2 className="text-xl font-bold">
              {format(currentDate, 'yyyy MMMM', { locale: enUS })}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="text-lg px-2 hover:text-blue-600"
            >
              ▶
            </button>
          </div>

          {/* Hamburger Icon + 팝업 박스 */}
          <div className="relative">
            <button onClick={() => setOpen(!open)}>
              <Image src="/icons/HamburgerButton.svg" alt="햄버거 버튼" width={36} height={36} />
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-[265px] h-[50px] bg-white rounded-lg flex items-center justify-between px-4"
                style={{
                  zIndex: 9999, // 달력을 가릴 수 있도록 z축 최상단
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 15px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* 왼쪽 텍스트 */}
                <span className="text-gray-800 font-medium text-base">회의 일정 수립</span>

                {/* 오른쪽 영역 */}
                <div
                  className="flex items-center justify-center rounded-lg text-xs font-semibold"
                  style={{
                    width: '60px',
                    height: '26px',
                    backgroundColor: '#B6F5DF',
                  }}
                >
                  진행중
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 캘린더 */}
        <div className="w-full bg-white rounded-lg p-4">
          <style jsx>{`
            .rbc-addons-dnd-over {
              position: relative;
            }
            .rbc-addons-dnd-over::after {
              content: '';
              position: absolute;
              bottom: 2px;
              left: 2px;
              right: 2px;
              height: 3px;
              background-color: #81d7d4;
              z-index: 9999;
              pointer-events: none;
              border-radius: 1.5px;
            }
            .rbc-addons-dnd-row-body .rbc-addons-dnd-over::after {
              top: auto;
              bottom: 2px;
            }
          `}</style>
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            toolbar={false}
            culture="en-US"
            views={['month']}
            style={{ height: '75vh' }}
            // 드래그 앤 드롭 관련 props
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            onDragStart={onDragStart}
            resizable={true}
            draggableAccessor={() => true} // 모든 이벤트를 드래그 가능하게 설정
            components={{
              header: (props) => {
                const dayName = format(props.date, 'eee', { locale: enUS });
                const isSunday = props.label === 'Sun';
                return (
                  <div className={`text-center font-semibold ${isSunday ? 'text-red-500' : ''}`}>
                    {dayName}
                  </div>
                );
              },
              dateCellWrapper: (props) => {
                return (
                  <div
                    className={
                      (props.value.getMonth() !== currentDate.getMonth() ? 'bg-white ' : '') +
                      ' text-left'
                    }
                  >
                    {props.children}
                  </div>
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
