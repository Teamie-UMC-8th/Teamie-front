'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { checkTaskDetail } from '@/services/taskDetail/checkTaskDetail';
import AddProfileButton from '@/components/AddProfileButton';
import BackButton from '@/components/BackButton';
import DeleteButton from '@/components/DeleteButton';
import DatePicker from '@/components/DatePicker';
import AddComment from '@/features/tasks/components/AddComment';
import FileUploader from '@/features/tasks/components/FileUploader';
import TaskDropdown from '@/features/tasks/components/TaskDropdown';
import {
  useUpdateTaskDetail,
  useTaskDeleteHandler,
  useTaskMemoHandler,
  useDeleteTask,
} from '@/hooks/mutations/useTaskDetail';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = Number(params.taskId);
  const projectId = Number(params.projectId);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isTaskDeleted, setIsTaskDeleted] = useState(false); // 삭제 완료 상태 추적
  const [isEditingName, setIsEditingName] = useState(false); // 업무 이름 수정 모드
  const [editingName, setEditingName] = useState(''); // 수정 중인 업무 이름

  const { memo, setMemo, handleMemoChange, handleMemoBlur } = useTaskMemoHandler();
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
          status: data.result.status,
          stepId: data.result.stepId,
          managersCount: data.result.managers?.length || 0,
          filesCount: data.result.files?.length || 0,
        });
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
      const date = new Date(data.result.deadline);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
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
    if (!currentUser || !projectHomeData?.result?.users) {
      console.log('권한 확인 실패: 사용자 정보 또는 프로젝트 데이터 없음', {
        currentUser,
        projectUsers: projectHomeData?.result?.users,
      });
      return false;
    }

    // 프로젝트 홈과 동일한 방식: 이메일로 비교
    const isMember = projectHomeData.result.users.some(
      (user: { email: string }) => user.email === currentUser.email
    );

    console.log('프로젝트 홈 권한 확인:', {
      currentUserEmail: currentUser.email,
      currentUserName: currentUser.name,
      projectUsers: projectHomeData.result.users.map(
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
    projectHomeData?.result?.users?.map((user: { id: number; name: string }) => ({
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

    // 상태 업데이트를 다음 렌더링 사이클로 지연
    setTimeout(() => {
      console.log('handleManagersChange - API 호출 시도:', {
        taskId,
        selectedUserIds,
      });

      if (data?.result) {
        updateTaskMutation.mutate({
          taskId,
          data: {
            ...data.result,
            managerIds: selectedUserIds,
            existingFileUrls: data.result.files?.map((f) => f.fileUrl) ?? [],
          },
        });
      }
    }, 0);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    if (data?.result) {
      // API가 기대하는 형식: 'YYYY-MM-DD HH:mm:ss' - 마감 기한을 23:59:59로 설정
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day} 23:59:59`;

      console.log('📅 날짜 변경:', {
        originalDate: date,
        formattedDate: formattedDate,
        localDateString: date.toLocaleDateString('ko-KR'),
        utcDate: date.toISOString(),
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
            <div className="text-[20px] w-[110px]">
              {selectedDate
                ? (() => {
                    const year = selectedDate.getFullYear();
                    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                    const day = selectedDate.getDate().toString().padStart(2, '0');
                    return `${year}.${month}.${day}`;
                  })()
                : task.deadline
                  ? (() => {
                      const date = new Date(task.deadline);
                      if (isNaN(date.getTime())) return '2025.01.01';
                      const year = date.getFullYear();
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const day = date.getDate().toString().padStart(2, '0');
                      return `${year}.${month}.${day}`;
                    })()
                  : '2025.01.01'}
            </div>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="ml-[20px] cursor-pointer"
            >
              <img src="/icons/deadline-calendar.svg" alt="마감기한" />
            </button>
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
        <div
          className="flex flex-row mt-[40px] ml-[40px]
        max-lg:ml-[24px]"
        >
          <div className="min-w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            비고
          </div>
          <textarea
            value={memo || task.memo || ''}
            onChange={(e) => handleMemoChange(e.target.value)}
            onBlur={() => handleMemoBlur(taskId, data)}
            className="min-w-[1288px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] 
          max-lg:w-[735px] max-lg:min-w-[735px] resize-none"
          />
        </div>

        <AddComment />
      </div>
    </div>
  );
}
