import StepHeader from './components/StepHeader';
import AddTaskButton from './components/AddTaskButton';
import TaskItem from '@/components/TaskItem';
import { useSteps } from './hooks/useSteps'; //

export default function StepsBoard() {
  const { steps, openStepIds, toggleStep, addStep } = useSteps();

  return (
    <div className="grid grid-cols-4 gap-x-[36px] gap-y-[60px] mt-[40px] px-[35px]">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col">
          <StepHeader
            stepName={step.name}
            isOpen={openStepIds.includes(step.id)}
            onToggle={() => toggleStep(step.id)}
          />

          {openStepIds.includes(step.id) && (
            <div className="flex flex-col gap-3 mt-6">
              {step.items.map((item) => (
                <TaskItem
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  deadline={item.deadline}
                  assignee={item.assignee}
                />
              ))}
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
