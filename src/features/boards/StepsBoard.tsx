import StepHeader from './components/StepHeader';
import AddTaskButton from './components/AddTaskButton';
import TaskItem from '@/components/TaskItem';
import { useSteps } from './hooks/useSteps';
import { BoardProps } from '@/types/board';

export default function StepsBoard({ steps, projectId }: BoardProps) {
  const { steps: localSteps, openStepIds, toggleStep, addStep } = useSteps(steps);

  return (
    <div className="grid grid-cols-4 gap-x-[36px] gap-y-[60px] mt-[60px] px-[35px]">
      {localSteps.map((step) => (
        <div key={step.id} className="flex flex-col">
          <StepHeader
            stepName={step.name}
            isOpen={openStepIds.includes(step.id)}
            onToggle={() => toggleStep(step.id)}
          />
          {openStepIds.includes(step.id) && (
            <div className="flex flex-col gap-3 mt-6">
              {/* Task 목록 렌더링 */}
              {step.items.map((task) => (
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
              {/* 업무 추가 버튼 */}
              <AddTaskButton
                stepName={step.name}
                className={step.items.length > 0 ? 'mt-[8px]' : ''}
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addStep}
        className="flex bg-[#F8F8F8] text-[#898989] w-[325px] h-[68px] items-center justify-center rounded-[8px] font-medium text-[18px]"
      >
        + STEP 추가
      </button>
    </div>
  );
}
