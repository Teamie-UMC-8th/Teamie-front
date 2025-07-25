import TaskItem from '@/components/TaskItem';
import { STATUS_ORDER } from '@/constants/constants';
import { BoardProps } from '@/types/board';

export default function StatusBoard({ steps, projectId }: BoardProps) {
  const allTasks = steps.flatMap((step) => step.items);

  return (
    <div className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem]">
      {STATUS_ORDER.map(({ status, color }) => {
        const tasksByStatus = allTasks.filter((task) => task.status === status);

        return (
          <div key={status} className="flex flex-col">
            <div
              className="w-full h-[2.875rem] flex items-center justify-center rounded-[0.5rem] font-medium text-[1.125rem]"
              style={{ backgroundColor: color }}
            >
              {status}
            </div>

            <div className="mt-4">
              {tasksByStatus.map((task) => (
                // Task 목록 렌더링
                <TaskItem
                  key={task.id}
                  projectId={projectId}
                  id={task.id}
                  title={task.title}
                  status={task.status}
                  deadline={task.deadline}
                  assignee={task.assignee}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
