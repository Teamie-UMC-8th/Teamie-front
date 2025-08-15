'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { checkTaskDetail } from '@/services/taskDetail/checkTaskDetail';
import AddProfileButton from '@/components/AddProfileButton';
import BackButton from '@/components/BackButton';
import DeleteButton from '@/components/DeleteButton';
import DatePicker from '@/components/DatePicker';
import MemoField from '@/features/tasks/components/MemoField';
import AddComment from '@/features/tasks/components/AddComment';
import FileUploader from '@/features/tasks/components/FileUploader';
import TaskDropdown from '@/features/tasks/components/TaskDropdown';
import {
  useUpdateTaskDetail,
  useTaskMemoHandler,
  useDeleteTask,
} from '@/hooks/mutations/useTaskDetail';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { SubEventType } from '@/types/webSocket';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = Number(params.taskId);
  const projectId = Number(params.projectId);
  const queryClient = useQueryClient();
  const { socket, isConnected, subscribe, unsubscribe } = useWebSocket();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isTaskDeleted, setIsTaskDeleted] = useState(false); // 삭제 완료 상태 추적
  const [isEditingName, setIsEditingName] = useState(false); // 업무 이름 수정 모드
  const [editingName, setEditingName] = useState(''); // 수정 중인 업무 이름

  const { handleMemoBlur } = useTaskMemoHandler();
  const updateTaskMutation = useUpdateTaskDetail();
  const deleteTaskMutation = useDeleteTask();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['taskDetail', taskId],
    queryFn: () => {
      console.log('🎯 TaskDetailPage - useQuery 시작:', { taskId, projectId });
      return checkTaskDetail(taskId);
    },
    enabled: !!taskId && !deleteTaskMutation.isPending && !isTaskDeleted, // 삭제 중이거나 삭제 완료된 경우 쿼리 비활성화
    retry: 1, // 재시도 횟수 제한
  });

  // 웹소켓 구독 및 이벤트 처리 (실시간 동기화)
  useEffect(() => {
    if (isConnected && socket && taskId) {
      // task 전용 룸과 프로젝트 대시보드 룸 모두 구독 (서버가 어느 쪽으로 publish하든 대응)
      subscribe(SubEventType.TASK_DETAIL, taskId);
      subscribe(SubEventType.PROJECT_DASHBOARD, projectId);
      console.log(`구독: ${SubEventType.TASK_DETAIL}:${taskId}`);
      console.log(`구독: ${SubEventType.PROJECT_DASHBOARD}:${projectId}`);

      const handlePublish = (data: {
        entity?: string;
        payload?: { id?: number; taskId?: number };
      }) => {
        console.log('웹소켓 이벤트 수신:', data);
        // 1) task 자체 변경 (상태, 담당자, 비고, 마감 등)
        if (
          data?.entity === 'task' &&
          (data.payload?.id === taskId || data.payload?.taskId === taskId)
        ) {
          console.log('변경 사항 발생에 따라 taskDetail 및 taskComments 쿼리 무효화', data);
          // 넓은 키로 무효화하여 문자열/숫자 taskId 혼용 및 하위 쿼리까지 포괄
          queryClient.invalidateQueries({ queryKey: ['taskDetail'], exact: false });
          queryClient.invalidateQueries({ queryKey: ['taskComments'], exact: false });
          return;
        }

        // 2) task_file 생성/삭제도 동일하게 task 상세/댓글을 리패치 (파일 섹션이 상세 응답에 포함)
        if (data && data.entity === 'task_file') {
          console.log('파일 변경 이벤트 감지로 taskDetail 무효화');
          // 상세/대시보드 모두 갱신
          queryClient.invalidateQueries({ queryKey: ['taskDetail'], exact: false });
          queryClient.invalidateQueries({ queryKey: ['dashboard'], exact: false });
          return;
        }

        // 3) 댓글/대댓글 이벤트: 서버가 comment/cocomment 엔티티를 사용한다면 대응
        if (data && typeof data.entity === 'string' && data.entity.includes('comment')) {
          // payload에 taskId가 오면 일치 여부 확인, 없으면 보수적으로 갱신
          if (!data.payload?.taskId || data.payload?.taskId === taskId) {
            console.log('댓글 관련 이벤트 감지로 taskComments 무효화');
            queryClient.invalidateQueries({ queryKey: ['taskComments'], exact: false });
            return;
          }
        }
      };

      const handleForceUnsubscribe = () => {
        console.log('강제 구독 해제');
        router.push(`/projects/${projectId}/dashboard`);
      };

      socket.on('publish', handlePublish);
      socket.on('unsubscribe-forced', handleForceUnsubscribe);

      return () => {
        unsubscribe(SubEventType.TASK_DETAIL, taskId);
        unsubscribe(SubEventType.PROJECT_DASHBOARD, projectId);
        console.log(`구독 해제: ${SubEventType.TASK_DETAIL}:${taskId}`);
        console.log(`구독 해제: ${SubEventType.PROJECT_DASHBOARD}:${projectId}`);
        socket.off('publish', handlePublish);
        socket.off('unsubscribe-forced', handleForceUnsubscribe);
      };
    }
  }, [isConnected, socket, taskId, projectId, subscribe, unsubscribe, queryClient, router]);

  // 삭제 성공 시 페이지 이동
  useEffect(() => {
    if (deleteTaskMutation.isSuccess && isTaskDeleted) {
      // 삭제 성공 후 이전 페이지로 이동
      router.back();
    }
  }, [deleteTaskMutation.isSuccess, isTaskDeleted, router]);

  // 404 에러 처리 - 업무가 삭제되었거나 존재하지 않는 경우
  useEffect(() => {
    if (error) {
      console.error('🎯 TaskDetailPage - useQuery 실패:', error);

      // 404 에러인 경우 업무가 삭제되었거나 존재하지 않음을 알림
      if (error instanceof Error && error.message.includes('404')) {
        alert('업무가 삭제되었거나 존재하지 않습니다.');
        // 대시보드로 리다이렉트
        window.location.href = `/projects/${projectId}/dashboard`;
      }
    }
  }, [error, projectId]);

  // 삭제 실패 시 isTaskDeleted 상태 되돌리기
  useEffect(() => {
    if (deleteTaskMutation.isError) {
      setIsTaskDeleted(false);
    }
  }, [deleteTaskMutation.isError]);

  // 데이터 로딩 상태 로깅
  useEffect(() => {
    if (data) {
      console.log('🎯 TaskDetailPage - useQuery 성공:', data);
      if (data?.result) {
        console.log('📋 TaskDetailPage - 업무 정보:', {
          name: data.result.name,
          deadline: data.result.deadline,
          memo: data.result.memo,
          status: data.result.status,
          stepId: data.result.stepId,
          managersCount: data.result.managers?.length || 0,
          managers: data.result.managers, // 담당자 배열 추가
          filesCount: data.result.files?.length || 0,
          files: data.result.files, // 파일 배열 추가
        });

        // 담당자 정보 상세 로깅
        if (data.result.managers && data.result.managers.length > 0) {
          console.log(
            '👥 담당자 상세 정보:',
            data.result.managers.map((manager: { userId: number; userName: string }) => ({
              userId: manager.userId,
              userName: manager.userName,
            }))
          );
        } else {
          console.log('👥 담당자 없음');
        }
      }
    }
  }, [data]);

  // 프로젝트 홈 데이터 가져오기 (담당자 검증을 위해)
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

  // 데이터가 로드되면 selectedDate를 업데이트
  useEffect(() => {
    if (data?.result?.deadline) {
      const dateString = data.result.deadline;
      // 날짜 문자열에서 날짜 부분만 추출 (YYYY-MM-DD 또는 YYYY-MM-DD HH:mm:ss 형식 모두 지원)
      const datePart = dateString.split(' ')[0]; // 시간 부분 제거
      const [year, month, day] = datePart.split('-').map(Number);

      if (year && month && day) {
        // 로컬 시간대의 날짜 객체 생성 (시간은 00:00:00으로 설정)
        const localDate = new Date(year, month - 1, day);
        setSelectedDate(localDate);
      }
    }
  }, [data?.result?.deadline]);

  // 업무 삭제 핸들러
  const handleDelete = () => {
    console.log('🎯 TaskDetailPage - 삭제 핸들러 호출:', { taskId, projectId });

    // taskId가 유효한지 확인
    if (!taskId || isNaN(taskId)) {
      console.error('❌ TaskDetailPage - 유효하지 않은 taskId:', taskId);
      alert('유효하지 않은 업무 ID입니다.');
      return;
    }

    // projectId가 유효한지 확인
    if (!projectId || isNaN(projectId)) {
      console.error('❌ TaskDetailPage - 유효하지 않은 projectId:', projectId);
      alert('유효하지 않은 프로젝트 ID입니다.');
      return;
    }

    // 삭제 시작 시 상태 설정
    setIsTaskDeleted(true);
    deleteTaskMutation.mutate({ taskId, projectId });
  };

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

  // 담당자 정보 (프로젝트 홈의 사용자 목록 사용)
  const availableProfiles =
    projectHomeData?.result?.project?.users?.map((user: { id: number; name: string }) => ({
      userId: user.id,
      userName: user.name,
    })) || [];

  const handleManagersChange = (selectedUserIds: number[]) => {
    console.log('handleManagersChange 호출:', selectedUserIds);

    // 프로젝트 멤버 권한 체크
    if (!isCurrentUserProjectMember()) {
      alert('프로젝트 멤버만 담당자를 수정할 수 있습니다.');
      return;
    }

    console.log('handleManagersChange - API 호출 시도:', {
      taskId,
      selectedUserIds,
    });

    if (data?.result) {
      const updateData = {
        ...data.result,
        managerIds: selectedUserIds,
        existingFileUrls: data.result.files?.map((f) => f.fileUrl) ?? [],
      };

      console.log('🔧 담당자 변경 - 전송할 데이터:', {
        taskId,
        updateData,
        managerIds: updateData.managerIds,
        managersCount: updateData.managerIds.length,
        originalManagers: data.result.managers,
      });

      updateTaskMutation.mutate({
        taskId,
        data: updateData,
      });
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    if (data?.result) {
      // 로컬 시간대를 유지하면서 날짜를 포맷팅
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day} 23:59:59`;

      console.log('📅 날짜 변경:', {
        originalDate: date,
        formattedDate: formattedDate,
        localDateString: date.toLocaleDateString('ko-KR'),
        // UTC 변환 없이 로컬 날짜 정보만 출력
        localDateInfo: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          localDateString: date.toLocaleDateString('ko-KR'),
        },
      });

      updateTaskMutation.mutate({
        taskId,
        data: {
          ...data.result,
          deadline: formattedDate,
          managerIds: data.result.managers.map((m) => m.userId),
          existingFileUrls: data.result.files?.map((f) => f.fileUrl) ?? [],
        },
      });
    }
  };

  // 업무 이름 수정 시작
  const handleNameEdit = () => {
    if (data?.result) {
      setIsEditingName(true);
      setEditingName(data.result.name || '');
    }
  };

  // 업무 이름 수정 완료
  const handleNameSave = () => {
    if (data?.result && editingName.trim() !== '') {
      updateTaskMutation.mutate({
        taskId,
        data: {
          ...data.result,
          name: editingName.trim(),
          managerIds: data.result.managers.map((m) => m.userId),
          existingFileUrls: data.result.files?.map((f) => f.fileUrl) ?? [],
        },
      });
    }
    setIsEditingName(false);
  };

  // 업무 이름 수정 취소
  const handleNameCancel = () => {
    setIsEditingName(false);
    setEditingName('');
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-4">업무를 불러오는 중 오류가 발생했습니다.</div>
          <div className="text-sm text-gray-500">
            API 서버가 준비되지 않았거나 네트워크 연결에 문제가 있을 수 있습니다.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없을 때 처리
  if (!data?.result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">업무를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const task = data.result;

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BackButton />
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNameSave();
                  } else if (e.key === 'Escape') {
                    handleNameCancel();
                  }
                }}
                onBlur={handleNameSave}
                className="text-[24px] text-black font-semibold border-black outline-none bg-transparent"
                autoFocus
              />
            </div>
          ) : (
            <h1
              className="text-[24px] text-black font-semibold cursor-pointer"
              onClick={handleNameEdit}
            >
              {task.name || '빈 업무'}
            </h1>
          )}
        </div>
        <div className="max-lg:mr-[74px]">
          <DeleteButton
            onDelete={handleDelete}
            modalTitle="이 업무를 정말 삭제하시겠습니까?"
            confirmText="삭제"
            cancelText="취소"
          />
        </div>
      </div>

      {/* 구분선 */}
      <div
        className="mt-[6px] border-[#E7E7E7] border-[1px] w-auto
      max-lg:w-[910px]"
      />

      {/* 업무 상세 정보 */}
      <div className="flex flex-col">
        <div
          className="flex mt-[60px] ml-[40px] items-center 
        max-lg:flex-col max-lg:items-start max-lg:ml-[24px]"
        >
          {/* 마감 기한 */}
          <div className="flex items-center relative">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              마감 기한
            </div>
            <div
              className={`flex items-center ${(() => {
                const shouldShow = selectedDate || task.deadline;
                console.log('🔍 마감기한 컨테이너 조건:', {
                  selectedDate,
                  taskDeadline: task.deadline,
                  shouldShow,
                  className: shouldShow ? 'w-[110px]' : 'w-0',
                });
                return shouldShow ? 'w-[110px]' : 'w-0';
              })()} overflow-hidden transition-all duration-200`}
            >
              <div
                className="text-[20px] cursor-pointer whitespace-nowrap"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                {(() => {
                  console.log('🔍 마감기한 표시 디버깅:', {
                    selectedDate,
                    taskDeadline: task.deadline,
                    hasSelectedDate: !!selectedDate,
                    hasTaskDeadline: !!task.deadline,
                  });

                  if (selectedDate) {
                    const year = selectedDate.getFullYear();
                    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                    const day = selectedDate.getDate().toString().padStart(2, '0');
                    const formattedDate = `${year}.${month}.${day}`;
                    console.log('📅 selectedDate 포맷팅 결과:', formattedDate);
                    return formattedDate;
                  } else if (task.deadline) {
                    console.log('📅 task.deadline 원본:', task.deadline);
                    const dateString = task.deadline;

                    // ISO 문자열 처리 (2025-08-06T23:59:59.000Z 형태)
                    let datePart;
                    if (dateString.includes('T')) {
                      // ISO 문자열인 경우 T를 기준으로 분리
                      datePart = dateString.split('T')[0];
                    } else {
                      // 일반 날짜 문자열인 경우 공백을 기준으로 분리
                      datePart = dateString.split(' ')[0];
                    }

                    console.log('📅 datePart 추출:', datePart);
                    const [year, month, day] = datePart.split('-').map(Number);
                    console.log('📅 파싱된 날짜:', { year, month, day });

                    if (year && month && day) {
                      const formattedDate = `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
                      console.log('📅 task.deadline 포맷팅 결과:', formattedDate);
                      return formattedDate;
                    }
                    console.log('❌ 날짜 파싱 실패');
                    return '';
                  } else {
                    console.log('❌ 날짜 데이터 없음');
                    return '';
                  }
                })()}
              </div>
            </div>
            <Image
              src="/icons/deadline-calendar.svg"
              alt="마감기한"
              width={32}
              height={32}
              className="ml-[10px] cursor-pointer"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            />
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              isOpen={isDatePickerOpen}
              onToggle={() => setIsDatePickerOpen(!isDatePickerOpen)}
            />
          </div>
          {/* 진행상태 */}
          <div
            className="flex items-center ml-[160px]
          max-lg:ml-[0px] max-lg:mt-[40px]"
          >
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px]">
              진행 상태
            </div>
            <TaskDropdown
              status={task.status}
              onChange={async (newStatus) => {
                console.log('TaskDetailPage - 상태 변경 시도:', {
                  currentStatus: task.status,
                  newStatus,
                });

                if (data?.result) {
                  const updateData = {
                    ...data.result,
                    status: newStatus,
                    managerIds: data.result.managers.map((m) => m.userId),
                    existingFileUrls: data.result.files?.map((f) => f.fileUrl) ?? [],
                  };

                  console.log('TaskDetailPage - 업데이트 데이터:', updateData);

                  try {
                    await updateTaskMutation.mutateAsync({
                      taskId,
                      data: updateData,
                    });
                    console.log('TaskDetailPage - 상태 변경 성공');
                  } catch (error) {
                    console.error('TaskDetailPage - 상태 변경 실패:', error);
                    const errorMessage =
                      error instanceof Error ? error.message : '상태 변경에 실패했습니다.';
                    alert(`상태 변경에 실패했습니다: ${errorMessage}`);
                  }
                } else {
                  console.error('TaskDetailPage - data.result가 없습니다.');
                  alert('업무 정보를 불러올 수 없습니다.');
                }
              }}
            />
          </div>
        </div>

        {/* 담당자 */}
        <div
          className="flex items-center ml-[40px] mt-[40px]
          max-lg:ml-[24px] max-lg:mt-[40px]"
        >
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px]  mr-[28px]">
            담당자
          </div>
          <AddProfileButton
            profiles={availableProfiles}
            onChange={handleManagersChange}
            onPermissionCheck={isCurrentUserProjectMember}
            initialSelectedIds={task.managers.map((m) => m.userId)}
            alertMessage="프로젝트 멤버만 담당자를 수정할 수 있습니다."
          />
        </div>

        {/* 첨부파일 */}
        <div
          className="flex flex-row mt-[40px] ml-[40px]
        max-lg:ml-[24px]"
        >
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] min-w-[99px]">
            첨부파일
          </div>
          <FileUploader />
        </div>

        {/* 비고 */}
        <MemoField
          taskId={taskId}
          taskData={data}
          initialMemo={task.memo}
          onMemoBlur={handleMemoBlur}
        />

        <AddComment />
      </div>
    </div>
  );
}
