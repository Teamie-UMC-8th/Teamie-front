'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AddProfileButton from '@/components/AddProfileButton';
import BackButton from '@/components/BackButton';
import DeleteButton from '@/components/DeleteButton';
import DatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import RemindMessageModal from '@/features/teamTask/components/RemindMessageModal';
import RemindMessageButton from '@/features/teamTask/components/RemindMessageButton';
import MemoField from '@/features/teamTask/components/MemoField';
import MeetingRecordsField from '@/features/teamTask/components/MeetingRecordsField';
import { projectHomeMockData } from '@/constants/projectHomeMockData';
import {
  useDeletePlan,
  useGetPlanDetail,
  usePatchPlan,
  usePatchPlanUsers,
} from '@/hooks/mutations/usePlan';

export default function TeamTaskDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const planId = params.planId as string;

  // API로 plan 데이터 가져오기
  const { data: planData, isLoading, error } = useGetPlanDetail(planId);
  const deletePlanMutation = useDeletePlan();
  const patchPlanMutation = usePatchPlan();
  const patchPlanUsersMutation = usePatchPlanUsers();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 0, 1));
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
  const [memo, setMemo] = useState('');
  const [meetingRecords, setMeetingRecords] = useState('');
  const [selectedWriters, setSelectedWriters] = useState<number[]>([]);

  // API 데이터로 상태 업데이트
  useEffect(() => {
    if (planData?.result) {
      const plan = planData.result;
      setScheduleName(plan.name || '빈 일정');
      setLocation(plan.location || '');
      setMemo(plan.memo || '');
      setMeetingRecords(plan.meetingRecords || '');

      // 날짜 설정
      if (plan.date) {
        setSelectedDate(new Date(plan.date));
      }

      // 시간 설정
      if (plan.startHour) {
        const [hour, minute] = plan.startHour.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        setSelectedTime({
          hour: hour12,
          minute,
          period,
        });
      }

      // 참석자 설정
      if (plan.attendees) {
        setSelectedAttendees(plan.attendees.map((attendee: { userId: number }) => attendee.userId));
      }

      // 기록자 설정
      if (plan.writers) {
        setSelectedWriters(plan.writers.map((writer: { userId: number }) => writer.userId));
      }
    }
  }, [planData]);

  // 참석자 정보 (API 데이터 우선, 없으면 mockdata 사용)
  const availableProfiles =
    planData?.result?.attendees?.map((attendee: { userId: number; name: string }) => ({
      userId: attendee.userId,
      userName: attendee.name,
    })) ||
    projectHomeMockData.result?.project.users.map((user) => ({
      userId: user.id,
      userName: user.name,
    })) ||
    [];

  const handleAttendeesChange = (selectedUserIds: number[]) => {
    setSelectedAttendees(selectedUserIds);
    // 프로젝트 멤버 권한 체크
    if (!isCurrentUserProjectMember()) {
      alert('프로젝트 멤버만 참석자를 수정할 수 있습니다.');
      return;
    }
    // 참석자 변경 시 자동 저장
    patchPlanUsersMutation.mutate({
      planId,
      userData: {
        attendees: selectedUserIds,
        writers: selectedWriters,
      },
    });
  };

  // 현재 사용자가 프로젝트 멤버인지 확인하는 함수
  const isCurrentUserProjectMember = () => {
    const currentUserId = 1; // 실제로는 인증된 사용자 ID를 가져와야 함
    return projectHomeMockData.result?.project.users.some((user) => user.id === currentUserId);
  };

  const handleWritersChange = (selectedUserIds: number[]) => {
    setSelectedWriters(selectedUserIds);
    // 프로젝트 멤버 권한 체크
    if (!isCurrentUserProjectMember()) {
      alert('프로젝트 멤버만 기록자를 수정할 수 있습니다.');
      return;
    }
    // 기록자 변경 시 자동 저장
    patchPlanUsersMutation.mutate({
      planId,
      userData: {
        attendees: selectedAttendees,
        writers: selectedUserIds,
      },
    });
  };

  const formatDate = (date: Date | undefined) => {
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
  const formatDateForModal = (date: Date | undefined) => {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}.${day}`;
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // 프로젝트 멤버 권한 체크
    if (!isCurrentUserProjectMember()) {
      console.error('권한 없음: 프로젝트 멤버만 일정을 수정할 수 있습니다.');

      return;
    }
    // 일자 변경 시 자동 저장
    patchPlanMutation.mutate({
      planId,
      planData: {
        date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      },
    });
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleTimeChange = (time: { hour: number; minute: number; period: 'AM' | 'PM' }) => {
    setSelectedTime(time);
    // 프로젝트 멤버 권한 체크
    if (!isCurrentUserProjectMember()) {
      console.error('권한 없음: 프로젝트 멤버만 일정을 수정할 수 있습니다.');

      return;
    }
    // 시간 변경 시 자동 저장
    const hour24 =
      time.period === 'PM' && time.hour !== 12
        ? time.hour + 12
        : time.period === 'AM' && time.hour === 12
          ? 0
          : time.hour;
    const formattedTime = `${hour24.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;

    patchPlanMutation.mutate({
      planId,
      planData: {
        startHour: formattedTime,
      },
    });
  };

  const toggleTimePicker = () => {
    setIsTimePickerOpen(!isTimePickerOpen);
  };

  const toggleRemindModal = () => {
    setIsRemindModalOpen(!isRemindModalOpen);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[20px]">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[20px] text-red-500">일정을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-[24px] text-black font-semibold">{scheduleName}</h1>
        </div>
        <div className="max-lg:mr-[74px]">
          <DeleteButton
            onDelete={() => {
              deletePlanMutation.mutate(planId);
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
              onBlur={(e) => {
                // 프로젝트 멤버 권한 체크
                if (!isCurrentUserProjectMember()) {
                  console.error('권한 없음: 프로젝트 멤버만 장소를 수정할 수 있습니다.');

                  return;
                }
                console.log('장소 수정 시도:', e.target.value);
                // 장소 변경 시 자동 저장 (포커스 아웃 시)
                patchPlanMutation.mutate({
                  planId,
                  planData: {
                    location: e.target.value,
                  },
                });
              }}
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
        <MemoField
          value={memo}
          onChange={setMemo}
          onBlur={(value) => {
            // 프로젝트 멤버 권한 체크
            if (!isCurrentUserProjectMember()) {
              alert('프로젝트 멤버만 비고를 수정할 수 있습니다.');
              return;
            }

            // 비고 변경 시 자동 저장 (포커스 아웃 시)
            patchPlanMutation.mutate({
              planId,
              planData: {
                memo: value,
              },
            });
          }}
        />

        {/* 회의록 */}
        <MeetingRecordsField
          value={meetingRecords}
          onChange={setMeetingRecords}
          onBlur={(value) => {
            // 프로젝트 멤버 권한 체크
            if (!isCurrentUserProjectMember()) {
              alert('프로젝트 멤버만 회의록을 수정할 수 있습니다.');
              return;
            }

            // 회의록 변경 시 자동 저장 (포커스 아웃 시)
            patchPlanMutation.mutate({
              planId,
              planData: {
                meetingRecords: value,
              },
            });
          }}
          availableProfiles={availableProfiles}
          selectedWriters={selectedWriters}
          onWritersChange={handleWritersChange}
        />
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
          .map(
            (id) =>
              availableProfiles.find(
                (profile: { userId: number; userName: string }) => profile.userId === id
              )?.userName || ''
          )
          .filter((name) => name !== '')}
        location={location}
        detailUrl={`/projects/${projectId}/teamcalendar/${planId}/${scheduleName}`}
      />
    </div>
  );
}
