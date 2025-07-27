'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
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

export default function TeamCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDateClick = (date) => {
    console.log('Add project clicked for date:', date);
    router.push('/schedulePage'); //프로젝트 일정 페이지로 이동
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

        // 클릭 이벤트
        // button.addEventListener('click', (e) => {
        //   e.stopPropagation();
        //   const dateStr = cell.querySelector('.rbc-button-link')?.getAttribute('aria-label');
        //   console.log('Clicked date:', dateStr);
        //   handleDateClick(new Date());
        // });

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
  }, [currentDate]); // currentDate가 변경될 때마다 재실행

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
          <Calendar
            localizer={localizer}
            events={[]}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            toolbar={false}
            culture="en-US"
            views={['month']}
            style={{ height: '75vh' }}
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
