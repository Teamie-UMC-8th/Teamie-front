'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AddProfileButton from '@/components/AddProfileButton';
import BackButton from '@/components/BackButton';
import DeleteButton from '@/components/DeleteButton';
import DatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import RemindMessageModal from '@/features/teamTask/components/RemindMessageModal';
import { projectHomeMockData } from '@/constants/projectHomeMockData';
import RemindMessageButton from '@/features/teamTask/components/RemindMessageButton';

export default function taskDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const planId = params.planId as string;

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 0, 1));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
    period: 'AM' | 'PM';
  }>({
    hour: 6,
    minute: 0,
    period: 'PM',
  });
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([]);
  const [isRemindModalOpen, setIsRemindModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [scheduleName, setScheduleName] = useState('빈 일정');

  // mockdata에서 사용자 정보 가져오기
  const availableProfiles =
    projectHomeMockData.result?.project.users.map((user) => ({
      userId: user.id,
      userName: user.name,
    })) || [];

  const handleAttendeesChange = (selectedUserIds: number[]) => {
    setSelectedAttendees(selectedUserIds);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formatTime = (time: { hour: number; minute: number; period: 'AM' | 'PM' }) => {
    let hour24 = time.hour;

    // PM인 경우 12를 더하고, AM이고 12시인 경우 0으로 변경
    if (time.period === 'PM' && time.hour !== 12) {
      hour24 = time.hour + 12;
    } else if (time.period === 'AM' && time.hour === 12) {
      hour24 = 0;
    }

    const hour = hour24.toString().padStart(2, '0');
    const minute = time.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  // 모달용 날짜 형식 (MM.DD)
  const formatDateForModal = (date: Date | null) => {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}.${day}`;
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleTimeChange = (time: { hour: number; minute: number; period: 'AM' | 'PM' }) => {
    setSelectedTime(time);
  };

  const toggleTimePicker = () => {
    setIsTimePickerOpen(!isTimePickerOpen);
  };

  const toggleRemindModal = () => {
    setIsRemindModalOpen(!isRemindModalOpen);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-[24px] text-black font-semibold">빈 일정</h1>
        </div>
        <div className="max-lg:mr-[74px]">
          <DeleteButton
            onDelete={() => {
              // 삭제 로직 작성
            }}
            modalTitle="이 일정을 정말 삭제하시겠습니까?"
            confirmText="삭제"
            cancelText="취소"
          />
        </div>
      </div>

      <div className="mt-[6px] max-lg:w-[910px] flex flex-col">
        {/* 구분선 */}
        <div className="border-[#E7E7E7] border-[1px] w-full" />
        {/* 리마인드 메세지 */}
        <RemindMessageButton onClick={toggleRemindModal} />
      </div>

      {/* 업무 상세 정보 */}
      <div className="flex flex-col">
        <div
          className="flex mt-[40px] ml-[40px] items-center gap-[160px] w-[1100px]
        max-lg:flex-col max-lg:items-start max-lg:ml-[24px] max-lg:gap-[40px]"
        >
          {/* 일자 */}
          <div className="flex items-center relative">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              일자
            </div>
            <div
              className="text-[20px] cursor-pointer flex items-center"
              onClick={toggleDatePicker}
            >
              {formatDate(selectedDate)}
            </div>
            <img
              src="/icons/deadline-calendar.svg"
              alt="TimePicker"
              className="ml-[20px] cursor-pointer"
              onClick={toggleDatePicker}
            />
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              isOpen={isDatePickerOpen}
              onToggle={toggleDatePicker}
            />
          </div>

          {/* 시작 시간 */}
          <div className="flex items-center relative">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              시작 시간
            </div>
            <div
              className="text-[20px] w-[60px] cursor-pointer flex items-center"
              onClick={toggleTimePicker}
            >
              {formatTime(selectedTime)}
            </div>
            <img
              src="/icons/timePicker.svg"
              alt="타임 피커"
              className="ml-[16px] cursor-pointer"
              onClick={toggleTimePicker}
            />
            <TimePicker
              selectedTime={selectedTime}
              onTimeChange={handleTimeChange}
              isOpen={isTimePickerOpen}
              onToggle={toggleTimePicker}
            />
          </div>
          {/* 마감 기한 */}
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              장소
            </div>
            <input
              type="text"
              placeholder="장소를 입력해주세요."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-[20px] border-none outline-none bg-transparent w-[174px] placeholder:text-[#898989]"
            />
          </div>
        </div>

        {/* 참석자 */}
        <div
          className="flex items-center ml-[40px] mt-[40px]
          max-lg:ml-[24px]"
        >
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px]  mr-[28px]">
            참석자
          </div>
          <AddProfileButton profiles={availableProfiles} onChange={handleAttendeesChange} />
        </div>

        {/* 비고 */}
        <div
          className="flex flex-row mt-[40px] ml-[40px] w-[1415px]
        max-lg:ml-[24px]"
        >
          <div className="min-w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            비고
          </div>
          <textarea
            className="w-[1290px] min-w-[1109px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] 
          max-lg:w-[738px] max-lg:h-[72px] max-lg:min-w-[735px]"
          />
        </div>

        {/* 회의록 */}
        <div
          className="flex-col mt-[40px] ml-[40px]
        max-lg:ml-[24px]"
        >
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              회의록
            </div>
            <div className="border-l-[2px] border-[#898989] h-[22px]" />
            <p className="text-[18px] ml-[12px] mr-[12px]">기록자</p>
            <div className="border-l-[2px] border-[#898989] h-[22px] mr-[12px]" />
            <AddProfileButton profiles={availableProfiles} onChange={handleAttendeesChange} />
          </div>
          <textarea
            className="w-[1415px] h-[428px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] mt-[15px]
          max-lg:w-[865px] max-lg:min-w-[369px]"
          />
        </div>
      </div>
      <RemindMessageModal
        isOpen={isRemindModalOpen}
        onClose={toggleRemindModal}
        scheduleName={scheduleName}
        date={
          selectedDate
            ? `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`
            : ''
        }
        time={formatTime(selectedTime)}
        attendees={selectedAttendees
          .map((id) => availableProfiles.find((profile) => profile.userId === id)?.userName || '')
          .filter((name) => name !== '')}
        location={location}
        detailUrl={`/projects/${projectId}/teamcalendar/${planId}/${scheduleName}`}
      />
    </div>
  );
}
