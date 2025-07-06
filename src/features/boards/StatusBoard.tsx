import TaskItem from '@/components/TaskItem';
import { mockSteps } from '../../constants/mockData';
import { STATUS_ORDER } from '../../constants/constants';

export default function StatusBoard() {
  const allTasks = mockSteps.flatMap((step) => step.items);

  return (
    <div className="flex gap-[80px] mt-[60px] ml-[35px]">
      {STATUS_ORDER.map(({ status, color }) => {
        const tasksByStatus = allTasks.filter((task) => task.status === status);

        return (
          <div key={status} className="flex flex-col">
            <div
              className="w-[325px] h-[46px] flex items-center justify-center rounded-[8px] font-medium text-[18px]"
              style={{ backgroundColor: color }}
            >
              {status}
            </div>

            <div className="mt-4">
              {tasksByStatus.map((task) => (
                <TaskItem
                  key={task.id}
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
