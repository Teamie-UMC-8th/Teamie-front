'use client';

import { useTaskItems } from '@/features/boards/hooks/useTaskItems';
import { TaskItemComponentProps, TASK_STATUS_STYLES } from '@/types/api/tasks';
import { useUpdateTaskStatus } from '@/hooks/mutations/useUpdateTaskStatus';
import Link from 'next/link';
import AssigneeCard from './AssigneeCard';
import { formatToKoreanDate } from '@/utils/formatDate';

// TaskItem 컴포넌트 Props에 onTaskComplete 콜백 추가
interface TaskItemProps extends TaskItemComponentProps {
  onTaskComplete?: (taskId: number, title: string) => void;
  isCompleted?: boolean;
}

export default function TaskItem({
  projectId,
  id: taskId,
  title,
  status,
  deadline,
  assignee,
  onTaskComplete,
  isCompleted = false,
}: TaskItemProps) {
  const { displayAssignees, deadlineTextColor } = useTaskItems({
    task: { id: taskId, title, status, deadline, assignee },
  });

  const updateTaskStatusMutation = useUpdateTaskStatus();

  const statusStyle = TASK_STATUS_STYLES[status] || TASK_STATUS_STYLES['시작 전'];

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    // 프로젝트가 종료된 경우 체크박스 비활성화
    if (isCompleted) return;

    // 현재 상태에 따라 토글
    let newStatus: 'ONGOING' | 'COMPLETED';
    if (status === '완료') {
      newStatus = 'ONGOING'; // 완료 → 진행 중
    } else {
      newStatus = 'COMPLETED'; // 진행 중 또는 시작 전 → 완료
    }

    // 새로운 API로 status만 업데이트
    updateTaskStatusMutation.mutate({
      taskId,
      status: newStatus,
    });

    // 완료 상태로 변경된 경우 부모 컴포넌트에 알림
    if (newStatus === 'COMPLETED' && onTaskComplete) {
      onTaskComplete(taskId, title);
    }
  };

  // 체크박스 상태 결정 (완료 상태일 때만 체크됨)
  const isChecked = status === '완료';

  return (
    <Link href={`/projects/${projectId}/tasks/${taskId}`} className="block w-[325px]">
      <div className="bg-white w-full h-full rounded-[8px] border border-[#BBBBBB] p-4 flex items-start gap-3">
        <label
          className="relative inline-flex items-center flex-shrink-0 mt-1"
          onClick={stop}
          onMouseDown={stop}
          onTouchStart={stop}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            disabled={isCompleted}
            className={`peer appearance-none w-[20px] h-[20px] border-2 border-[#898989] rounded bg-white checked:bg-[#81D7D4] ${
              isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={stop}
            onMouseDown={stop}
            onTouchStart={stop}
          />
          <svg
            className="hidden peer-checked:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.8383 12C4.41459 12 4.0133 11.826 3.75615 11.526L0.275947 7.47901C0.168101 7.35411 0.0893379 7.21171 0.0441773 7.05996C-0.00098324 6.90821 -0.0116524 6.7501 0.0127817 6.59472C0.0372158 6.43933 0.0962722 6.28972 0.186563 6.15447C0.276853 6.01922 0.396601 5.90099 0.538935 5.80656C0.680907 5.71139 0.842861 5.64185 1.01548 5.60195C1.1881 5.56206 1.36798 5.5526 1.54477 5.57411C1.72156 5.59562 1.89177 5.64768 2.04562 5.72729C2.19947 5.80691 2.33391 5.91251 2.44121 6.03802L4.73115 8.69884L10.4886 0.562076C10.6796 0.293422 10.9838 0.102387 11.3346 0.0308751C11.6853 -0.040637 12.054 0.0132126 12.3597 0.180612C12.9958 0.528644 13.1916 1.26586 12.7942 1.82648L5.99155 11.4359C5.87542 11.6007 5.71536 11.7381 5.52525 11.8361C5.33515 11.9341 5.12074 11.9897 4.90063 11.9983L4.8383 12Z"
              fill="white"
            />
          </svg>
        </label>

        <div className="flex flex-col flex-1 gap-[10px]">
          <div className="font-normal text-[16px] text-black mt-[1px]">{title}</div>

          <div className="flex items-center justify-between gap-[2px] text-[14px]">
            <span className="min-w-[7.5rem]">
              {deadline && (
                <span className={deadlineTextColor}>{formatToKoreanDate(deadline)}</span>
              )}
            </span>

            <div
              className={`flex items-center justify-center px-2 py-0.5 w-[63px] h-[22px] rounded-full font-regular ${statusStyle.bg} ${statusStyle.text}`}
            >
              {status}
            </div>
          </div>

          {displayAssignees && (
            <div className="mt-auto flex flex-wrap gap-2">
              {displayAssignees.displayList.map((assignee, index) => (
                <AssigneeCard
                  key={index}
                  name={assignee.name}
                  imageUrl={assignee.imageUrl}
                  size="sm"
                />
              ))}
              {displayAssignees.hasMore && (
                <div className="inline-flex items-center rounded-[30px] p-[3px] pr-[9px] text-[12px] text-[#898989]">
                  ...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
