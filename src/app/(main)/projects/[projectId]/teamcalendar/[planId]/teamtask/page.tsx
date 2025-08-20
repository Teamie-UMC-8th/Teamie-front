'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import axiosInstance from '@/lib/axiosInstance';
import AddProfileButton from '@/components/AddProfileButton';
import BackButton from '@/components/BackButton';
import DeleteButton from '@/components/DeleteButton';
import DatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import RemindMessageModal from '@/features/teamTask/components/RemindMessageModal';
import RemindMessageButton from '@/features/teamTask/components/RemindMessageButton';
import MemoField from '@/features/teamTask/components/MemoField';
import MeetingRecordsField from '@/features/teamTask/components/MeetingRecordsField';
import {
  useDeletePlan,
  useGetPlanDetail,
  usePatchPlan,
  usePatchPlanUsers,
} from '@/hooks/mutations/usePlan';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { SubEventType, WebSocketResponseUnion, isPlanResponse } from '@/types/webSocket';

export default function TeamTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { socket, isConnected, subscribe, unsubscribe } = useWebSocket();
  const projectId = params.projectId as string;
  const planId = params.planId as string;

  // API로 plan 데이터 가져오기
  const { data: planData, isLoading, error } = useGetPlanDetail(planId);

  // 프로젝트 홈 데이터 가져오기 (참석자 검증을 위해)
  const { data: projectHomeData } = useQuery({
    queryKey: ['projectHome', projectId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/projects/${projectId}`);
        return res.data;
      } catch (error) {
        console.warn('프로젝트 홈 데이터를 불러올 수 없습니다:', error);
        return null;
      }
    },
    retry: 1,
  });

  const deletePlanMutation = useDeletePlan();
  const patchPlanMutation = usePatchPlan();
  const patchPlanUsersMutation = usePatchPlanUsers();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 0, 1));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
    period: 'AM' | 'PM';
  } | null>(null);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([]);
  const [isRemindModalOpen, setIsRemindModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [scheduleName, setScheduleName] = useState('빈 일정');
  const [memo, setMemo] = useState('');
  const [meetingRecords, setMeetingRecords] = useState('');
  const [selectedWriters, setSelectedWriters] = useState<number[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  // API 데이터로 상태 업데이트
  useEffect(() => {
    if (planData?.result) {
      const plan = planData.result;
      setScheduleName(plan.name || '빈 일정');
      setEditingTitle(plan.name || '빈 일정');
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
      } else {
        setSelectedTime(null);
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

  // 웹소켓 연결 및 이벤트 핸들링
  useEffect(() => {
    if (isConnected && socket) {
      const planIdNum = parseInt(planId);
      if (isNaN(planIdNum)) return;

      // 1. plan:notification 룸 구독
      subscribe(SubEventType.PLAN_DETAIL, planIdNum);
      console.log(`구독: ${SubEventType.PLAN_DETAIL}:${planIdNum}`);

      // 2. publish 이벤트 수신 - 실시간 업데이트 처리
      const handlePublish = (data: WebSocketResponseUnion) => {
        console.log('웹소켓 이벤트 수신:', data);

        // 타입 가드를 사용하여 entity가 'plan'이고 현재 페이지의 planId와 일치하는 경우에만 처리
        if (isPlanResponse(data) && data.payload.id === planIdNum) {
          console.log(
            `변경 사항 발생에 따라 planDetail 쿼리 무효화 (이벤트: ${data.entity}.${data.type})`
          );

          queryClient.invalidateQueries({
            queryKey: ['planDetail', planId],
          });
        }
      };

      // 3. unsubscribe-forced 이벤트 수신 - 강제 구독 해제
      const handleForceUnsubscribe = () => {
        console.log('강제 구독 해제');
        router.back();
      };

      // 이벤트 리스너 등록
      socket.on('publish', handlePublish);
      socket.on('unsubscribe-forced', handleForceUnsubscribe);

      // 컴포넌트 언마운트 시 정리
      return () => {
        // 구독 해제
        unsubscribe(SubEventType.PLAN_DETAIL, planIdNum);
        console.log(`구독 해제: ${SubEventType.PLAN_DETAIL}:${planIdNum}`);

        // 이벤트 리스너 제거
        socket.off('publish', handlePublish);
        socket.off('unsubscribe-forced', handleForceUnsubscribe);
      };
    }
  }, [isConnected, socket, planId, projectId, subscribe, unsubscribe, queryClient, router]);

  // 참석자 정보 (프로젝트 홈의 사용자 목록 사용)
  const availableProfiles =
    projectHomeData?.result?.project?.users?.map((user: { id: number; name: string }) => ({
      userId: user.id,
      userName: user.name,
    })) || [];

  // 프로젝트 생성일 (선택 가능한 최소 날짜)
  const projectCreatedAtString =
    projectHomeData?.result?.project?.createAt ||
    projectHomeData?.result?.createAt ||
    projectHomeData?.result?.project?.createdAt ||
    projectHomeData?.result?.createdAt;
  const projectCreatedAtDate = projectCreatedAtString
    ? new Date(projectCreatedAtString)
    : undefined;

  const handleAttendeesChange = (selectedUserIds: number[]) => {
    console.log('handleAttendeesChange 호출:', selectedUserIds);

    // 프로젝트 멤버 권한 체크
    if (!isCurrentUserProjectMember()) {
      alert('프로젝트 멤버만 참석자를 수정할 수 있습니다.');
      return;
    }

    // 상태 업데이트를 다음 렌더링 사이클로 지연
    setTimeout(() => {
      console.log('handleAttendeesChange - API 호출 시도:', {
        planId: planId.toString(),
        selectedUserIds,
        selectedWriters,
      });

      setSelectedAttendees(selectedUserIds);
      // 참석자 변경 시 자동 저장 (API 데이터 기반으로 업데이트)
      const currentWriters =
        planData?.result?.writers?.map((w: { userId: number }) => w.userId) || [];
      patchPlanUsersMutation.mutate({
        planId: planId.toString(),
        userData: {
          attendees: selectedUserIds,
          writers: currentWriters,
        },
      });
    }, 0);
  };

  // 현재 사용자 정보 가져오기
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/v1/users/me');
        return res.data.result;
      } catch (error) {
        console.warn('현재 사용자 정보를 불러올 수 없습니다:', error);
        return null;
      }
    },
    retry: 1,
  });

  // 현재 사용자가 프로젝트 홈의 프로필 카드에 연동되어 있는지 확인하는 함수
  const isCurrentUserProjectMember = () => {
    if (!currentUser || !projectHomeData?.result?.project?.users) {
      console.log('권한 확인 실패: 사용자 정보 또는 프로젝트 데이터 없음', {
        currentUser,
        projectUsers: projectHomeData?.result?.project?.users,
      });
      return false;
    }

    // 프로젝트 홈과 동일한 방식: 이메일로 비교
    const isMember = projectHomeData.result.project?.users.some(
      (user: { email: string }) => user.email === currentUser.email
    );

    console.log('프로젝트 홈 권한 확인:', {
      currentUserEmail: currentUser.email,
      currentUserName: currentUser.name,
      projectUsers: projectHomeData.result.project?.users.map(
        (u: { id: number; name: string; email: string }) => ({
          id: u.id,
          name: u.name,
          email: u.email,
        })
      ),
      isMember,
    });

    return isMember;
  };

  const handleWritersChange = (selectedUserIds: number[]) => {
    // 프로젝트 멤버 권한 체크
    if (!isCurrentUserProjectMember()) {
      alert('프로젝트 멤버만 기록자를 수정할 수 있습니다.');
      return;
    }

    // 상태 업데이트를 다음 렌더링 사이클로 지연
    setTimeout(() => {
      setSelectedWriters(selectedUserIds);
      // 기록자 변경 시 자동 저장 (API 데이터 기반으로 업데이트)
      const currentAttendees =
        planData?.result?.attendees?.map((a: { userId: number }) => a.userId) || [];
      patchPlanUsersMutation.mutate({
        planId: planId.toString(),
        userData: {
          attendees: currentAttendees,
          writers: selectedUserIds,
        },
      });
    }, 0);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formatTime = (time: { hour: number; minute: number; period: 'AM' | 'PM' } | null) => {
    if (!time) return '';

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

  // 모달용 날짜 형식 (MM.DD) - 현재 사용되지 않음
  // const formatDateForModal = (date: Date | undefined) => {
  //   if (!date) return '';
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   return `${month}.${day}`;
  // };

  const handleDateChange = (date: Date) => {
    // 프로젝트 생성일 이전 선택 방지 (클라이언트 가드)
    if (projectCreatedAtDate) {
      const min = new Date(
        projectCreatedAtDate.getFullYear(),
        projectCreatedAtDate.getMonth(),
        projectCreatedAtDate.getDate()
      );
      const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (selected < min) {
        console.warn('프로젝트 생성일 이전은 선택할 수 없습니다.');
        return;
      }
    }

    setSelectedDate(date);
    // 프로젝트 홈 권한 체크
    if (!isCurrentUserProjectMember()) {
      console.error('권한 없음: 프로젝트 멤버만 일정을 수정할 수 있습니다.');
      return;
    }
    // 일자 변경 시 자동 저장 (API 형식에 맞게 ISO 문자열로 변환)
    const isoDate = date.toISOString();
    patchPlanMutation.mutate({
      planId: planId.toString(),
      planData: {
        date: isoDate,
      },
    });
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleTimeChange = (time: { hour: number; minute: number; period: 'AM' | 'PM' }) => {
    setSelectedTime(time);
    // 프로젝트 홈 권한 체크
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
      planId: planId.toString(),
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

  // 선택한 날짜까지는 버튼이 보이는 함수 (선택한 날짜 이후부터는 버튼이 안보임)
  const isSelectedDateNotPassed = (selectedDate: Date | undefined) => {
    if (!selectedDate) return false;

    const now = new Date();
    const selectedDateOnly = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return nowOnly <= selectedDateOnly;
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setEditingTitle(scheduleName);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    setScheduleName(editingTitle);

    // 프로젝트 홈 권한 체크
    if (!isCurrentUserProjectMember()) {
      alert('프로젝트 멤버만 일정명을 수정할 수 있습니다.');
      return;
    }

    // 일정명 변경 시 자동 저장
    patchPlanMutation.mutate({
      planId: planId.toString(),
      planData: {
        name: editingTitle,
      },
    });
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setEditingTitle(scheduleName);
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
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave();
                  } else if (e.key === 'Escape') {
                    handleTitleCancel();
                  }
                }}
                onBlur={handleTitleSave}
                className="text-[24px] text-black font-semibold border-black outline-none bg-transparent"
                autoFocus
              />
            </div>
          ) : (
            <h1
              className="text-[24px] text-black font-semibold cursor-pointer "
              onClick={handleTitleEdit}
            >
              {scheduleName}
            </h1>
          )}
        </div>
        <div className="max-lg:mr-[74px]">
          <DeleteButton
            onDelete={() => {
              deletePlanMutation.mutate(planId.toString());
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
        {/* 리마인드 메세지 - 선택한 날짜가 지나지 않았을 때만 표시 */}
        {isSelectedDateNotPassed(selectedDate) && (
          <RemindMessageButton onClick={toggleRemindModal} />
        )}
      </div>

      {/* 업무 상세 정보 */}
      <div className="flex flex-col">
        <div
          className="flex mt-[40px] ml-[40px] items-center gap-[160px] w-[1300px]
        max-lg:flex-col max-lg:items-start max-lg:ml-[24px] max-lg:gap-[40px] max-lg:mt-[20px]"
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
            <Image
              src="/icons/deadline-calendar.svg"
              alt="TimePicker"
              width={32}
              height={32}
              className="ml-[20px] cursor-pointer"
              onClick={toggleDatePicker}
            />
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              isOpen={isDatePickerOpen}
              onToggle={toggleDatePicker}
              minDate={projectCreatedAtDate}
            />
          </div>

          {/* 시작 시간 */}
          <div className="flex items-center relative w-[390px]">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[30px] flex-shrink-0">
              시작 시간
            </div>
            <div
              className={`flex items-center ${selectedTime ? 'w-[68px]' : 'w-0'} overflow-hidden transition-all duration-200`}
            >
              <div
                className="text-[20px] cursor-pointer whitespace-nowrap"
                onClick={toggleTimePicker}
              >
                {selectedTime ? formatTime(selectedTime) : ''}
              </div>
            </div>
            <Image
              src="/icons/timePicker.svg"
              alt="타임 피커"
              width={32}
              height={32}
              className=" cursor-pointer"
              onClick={toggleTimePicker}
            />
            <TimePicker
              selectedTime={selectedTime || { hour: 1, minute: 0, period: 'AM' }}
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
                // 프로젝트 홈 권한 체크
                if (!isCurrentUserProjectMember()) {
                  console.error('권한 없음: 프로젝트 멤버만 장소를 수정할 수 있습니다.');
                  return;
                }
                console.log('장소 수정 시도:', e.target.value);
                // 장소 변경 시 자동 저장 (포커스 아웃 시)
                patchPlanMutation.mutate({
                  planId: planId.toString(),
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
          <AddProfileButton
            profiles={availableProfiles}
            initialSelectedIds={selectedAttendees}
            onChange={handleAttendeesChange}
            onPermissionCheck={isCurrentUserProjectMember}
            alertMessage="프로젝트 멤버만 참석자를 수정할 수 있습니다."
          />
        </div>

        {/* 비고 */}
        <MemoField
          value={memo}
          onChange={setMemo}
          onBlur={(value) => {
            // 프로젝트 홈 권한 체크
            if (!isCurrentUserProjectMember()) {
              console.log('프로젝트 멤버만 비고를 수정할 수 있습니다.');
              return;
            }

            // 비고 변경 시 자동 저장 (포커스 아웃 시)
            patchPlanMutation.mutate({
              planId: planId.toString(),
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
            // 프로젝트 홈 권한 체크
            if (!isCurrentUserProjectMember()) {
              console.log('프로젝트 멤버만 회의록을 수정할 수 있습니다.');
              return;
            }

            // 회의록 변경 시 자동 저장 (포커스 아웃 시)
            patchPlanMutation.mutate({
              planId: planId.toString(),
              planData: {
                meetingRecords: value,
              },
            });
          }}
          availableProfiles={availableProfiles}
          selectedWriters={selectedWriters}
          onWritersChange={handleWritersChange}
          onPermissionCheck={isCurrentUserProjectMember}
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
        time={selectedTime ? formatTime(selectedTime) : ''}
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
