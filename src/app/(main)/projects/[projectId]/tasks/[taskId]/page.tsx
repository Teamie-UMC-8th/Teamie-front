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
} from '@/hooks/mutations/useTaskDetail';
import { getMockUserList } from '@/constants/taskDetailMockData';
import axiosInstance from '@/lib/axiosInstance';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = Number(params.taskId);
  const projectId = Number(params.projectId);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ['taskDetail', taskId],
    queryFn: () => checkTaskDetail(taskId),
    enabled: !!taskId,
    retry: 1, // 재시도 횟수 제한
  });

  const { data: usersData } = useQuery({
    queryKey: ['userList'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/v1/users');
        return res.data.result;
      } catch (error) {
        console.warn('사용자 목록을 불러올 수 없습니다:', error);

        // 개발 모드에서만 모의 데이터 사용
        if (process.env.NODE_ENV === 'development') {
          return getMockUserList();
        }

        return []; // 빈 배열 반환
      }
    },
    retry: 1, // 재시도 횟수 제한
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

  const updateTaskMutation = useUpdateTaskDetail();
  const { handleDelete } = useTaskDeleteHandler();
  const { memo, handleMemoChange } = useTaskMemoHandler();

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    if (task) {
      updateTaskMutation.mutate({
        taskId,
        data: {
          ...task,
          deadline: date.toISOString(),
          managerIds: task.managers.map((m) => m.userId),
          existingFileUrls: task.files?.map((f) => f.fileUrl) ?? [],
        },
      });
    }
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
          <h1 className="text-[24px] text-black font-semibold">{task.name || '빈 업무'}</h1>
        </div>
        <div className="max-lg:mr-[74px]">
          <DeleteButton onDelete={() => handleDelete(taskId, projectId)} />
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
              onChange={(newStatus) => {
                updateTaskMutation.mutate({
                  taskId,
                  data: {
                    ...task,
                    status: newStatus,
                    managerIds: task.managers.map((m) => m.userId),
                    existingFileUrls: task.files?.map((f) => f.fileUrl) ?? [],
                  },
                });
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
            profiles={usersData || []}
            onChange={(newSelectedUserIds) => {
              updateTaskMutation.mutate({
                taskId,
                data: {
                  ...task,
                  managerIds: newSelectedUserIds,
                  existingFileUrls: task.files?.map((f) => f.fileUrl) ?? [],
                },
              });
            }}
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
            onChange={(e) => handleMemoChange(e.target.value, taskId, data)}
            placeholder="비고를 입력하세요..."
            className="min-w-[1288px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] 
          max-lg:w-[735px] max-lg:min-w-[735px] resize-none"
          />
        </div>

        <AddComment />
      </div>
    </div>
  );
}
