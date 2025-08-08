import TaskItem from '@/components/TaskItem';
import { STATUS_ORDER } from '@/constants/constants';
import { StatusBoardProps } from '@/types/board';
import { Task } from '@/types/api/tasks';

export default function StatusBoard({ statusGroups, projectId }: StatusBoardProps) {
  // API 상태를 표시 상태로 변환
  const getDisplayStatus = (apiStatus: string) => {
    switch (apiStatus) {
      case 'ONGOING':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      case 'NOTSTART':
        return '시작 전';
      case 'PENDING':
        return '시작 전';
      default:
        return '시작 전';
    }
  };

  // statusGroups 구조에 맞게 모든 업무를 평탄화하고 status 정보 추가
  const allTasksWithStatus: (Task & { displayStatus: string })[] = statusGroups.flatMap(
    (statusGroup) =>
      (statusGroup.tasks || []).map((task: Task) => ({
        ...task,
        displayStatus: getDisplayStatus(statusGroup.status),
      }))
  );

  return (
    <div className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem]">
      {STATUS_ORDER.map(({ status, color }) => {
        // 해당 상태의 업무들 필터링
        const tasksByStatus = allTasksWithStatus.filter((task) => task.displayStatus === status);

        return (
          <div key={status} className="flex flex-col">
            <div
              className="w-full h-[2.875rem] flex items-center justify-center rounded-[0.5rem] font-medium text-[1.125rem]"
              style={{ backgroundColor: color }}
            >
              {status}
            </div>

            <div className="mt-4 space-y-3">
              {tasksByStatus.map((task) => (
                <TaskItem
                  key={task.taskId}
                  projectId={projectId}
                  id={task.taskId}
                  title={task.taskName}
                  status={task.displayStatus}
                  deadline={task.deadline}
                  assignee={task.managers.map((manager) => manager.userName)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
