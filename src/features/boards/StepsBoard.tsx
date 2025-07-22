import StepHeader from './components/StepHeader';
import AddTaskButton from './components/AddTaskButton';
import TaskItem from '@/components/TaskItem';
import { useSteps } from './hooks/useSteps';
import { BoardProps } from '@/types/board';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import React from 'react';

export default function StepsBoard({ steps, projectId }: BoardProps) {
  const { steps: localSteps, openStepIds, toggleStep, addStep, moveTask } = useSteps(steps);

  // TODO: 실제로는 step 삭제 로직을 구현해야 함
  const handleDeleteStep = (stepId: number) => {
    alert(`STEP ${stepId} 삭제!`);
  };

  // 드래그가 끝났을 때 호출되는 함수
  // source: 드래그 시작한 위치, destination: 드롭한 위치
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // 드롭할 위치가 없으면 아무것도 안 함
    if (!destination) return;

    // source, destination: { droppableId, index }
    const sourceStepId = Number(source.droppableId);
    const destStepId = Number(destination.droppableId);

    // 같은 위치에 드롭했으면 아무것도 안 함
    if (sourceStepId === destStepId && source.index === destination.index) {
      return;
    }

    // Task를 한 Step에서 다른 Step으로 이동
    moveTask(sourceStepId, destStepId, source.index, destination.index);
  };

  return (
    // 전체 드래그앤드롭 컨텍스트 - 모든 드래그앤드롭 이벤트를 관리
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem]">
        {localSteps.map((step) => (
          <div key={step.id} className="flex flex-col">
            <StepHeader
              stepName={step.name}
              isOpen={openStepIds.includes(step.id)}
              onToggle={() => toggleStep(step.id)}
              showDelete={step.items.length === 0}
              onDelete={() => handleDeleteStep(step.id)}
            />
            {openStepIds.includes(step.id) && (
              // 각 Step은 드롭 가능한 영역 (Droppable)
              // droppableId: 각 Step을 구분하는 고유 ID
              <Droppable droppableId={step.id.toString()}>
                {(provided) => (
                  // 드롭 가능한 영역의 실제 div
                  // ref: DnD 라이브러리가 이 div를 드롭 영역으로 인식하게 함
                  // ...provided.droppableProps: 드롭 관련 이벤트 핸들러들
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col mt-6 min-h-[0.625rem]"
                  >
                    {/* 각 TaskItem은 드래그 가능한 아이템 (Draggable) */}
                    {step.items.map((task, idx) => (
                      // draggableId: 각 TaskItem을 구분하는 고유 ID
                      // index: TaskItem의 순서 (0, 1, 2, ...)
                      <Draggable
                        key={`${step.id}-${task.id}`}
                        draggableId={task.id.toString()}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          // 드래그 가능한 아이템의 실제 div
                          // ref: DnD 라이브러리가 이 div를 드래그 아이템으로 인식하게 함
                          // ...provided.draggableProps: 드래그 관련 스타일 (transform, transition 등)
                          // ...provided.dragHandleProps: 드래그 핸들러 (어디를 잡고 드래그할지)
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`mb-3 last:mb-0 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            style={{
                              ...provided.draggableProps.style,
                              width: '100%',
                              height: '7.625rem',
                            }}
                          >
                            <div {...provided.dragHandleProps}>
                              <TaskItem
                                projectId={projectId}
                                id={task.id}
                                title={task.title}
                                status={task.status}
                                deadline={task.deadline}
                                assignee={task.assignee}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    <div className="mt-2">
                      <AddTaskButton stepName={step.name} />
                    </div>
                  </div>
                )}
              </Droppable>
            )}
          </div>
        ))}
        <button
          onClick={addStep}
          className="flex bg-[#F8F8F8] text-[#898989] w-full h-[4.25rem] items-center justify-center rounded-[0.5rem] font-medium text-[1.125rem] cursor-pointer hover:bg-[#F0F0F0] transition-colors duration-200"
        >
          + STEP 추가
        </button>
      </div>
    </DragDropContext>
  );
}
