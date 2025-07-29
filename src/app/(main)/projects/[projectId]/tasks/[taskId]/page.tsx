'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { checkTaskDetail } from '@/services/taskDetail/checkTaskDetail';
import { useParams } from 'next/navigation';
import AddProfileButton from '@/components/AddProfileButton';
import BackButton from '@/components/BackButton';
import DeleteButton from '@/components/DeleteButton';
import AddComment from '@/features/tasks/components/AddComment';
import FileUploader from '@/features/tasks/components/FileUploader';
import TaskDropdown from '@/features/tasks/components/TaskDropdown';
import { useUpdateTaskDetail } from '@/hooks/mutations/useTaskDetail';

export default function taskDetailPage() {
  const params = useParams();
  const taskId = Number(params.taskId);
  const projectId = Number(params.projectId);

  const { data, isLoading } = useQuery({
    queryKey: ['taskDetail', taskId],
    queryFn: () => checkTaskDetail(taskId),
    enabled: !!taskId,
  });

  const { data: usersData } = useQuery({
    queryKey: ['userList'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/users');
      return res.data.result;
    },
  });

  const updateTaskMutation = useUpdateTaskDetail();

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-[24px] text-black font-semibold">{data?.result.name || '빈 업무'}</h1>
        </div>
        <div className="max-lg:mr-[74px]">
          <DeleteButton
            onDelete={async () => {
              try {
                await fetch(`/api/v1/tasks/${taskId}`, {
                  method: 'DELETE',
                });
                window.location.href = `/projects/${projectId}/dashboard`;
              } catch (err) {
                console.error(err);
                alert('삭제 중 오류가 발생했습니다.');
              }
            }}
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
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              마감 기한
            </div>
            <div className="text-[20px]">2025.01.01</div>
            <img src="/icons/deadline-calendar.svg" alt="마감기한" className="ml-[20px]" />
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
              status={data?.result.status || 'BEFORE'}
              onChange={(newStatus) => {
                if (!data) return;
                updateTaskMutation.mutate({
                  taskId,
                  data: {
                    ...data.result,
                    status: newStatus,
                    managerIds: data.result.managers.map((m) => m.userId),
                    existingFileUrls: data.result.files?.map((f) => f.fileUrl) ?? [],
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
              if (!data) return;
              updateTaskMutation.mutate({
                taskId,
                data: {
                  ...data.result,
                  managerIds: newSelectedUserIds,
                  existingFileUrls: data.result.files?.map((f) => f.fileUrl) ?? [],
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
            className="w-[1109px] min-w-[1109px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] 
          max-lg:w-[735px] max-lg:min-w-[735px]"
          />
        </div>

        <AddComment />
      </div>
    </div>
  );
}
