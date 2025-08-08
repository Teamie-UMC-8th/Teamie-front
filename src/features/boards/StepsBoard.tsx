import StepHeader from './components/StepHeader';
import AddTaskButton from './components/AddTaskButton';
import TaskItem from '@/components/TaskItem';
import { useSteps } from './hooks/useSteps';
import { BoardProps } from '@/types/board';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import React, { useState } from 'react';
import { useCreateStep } from '@/hooks/mutations/useCreateStep';

export default function StepsBoard({ steps, projectId }: BoardProps) {
  const { openStepIds, toggleStep } = useSteps();
  const createStepMutation = useCreateStep();
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepName, setNewStepName] = useState('');

  // STEP 추가 제한 (최대 8개)
  const canAddStep = steps.length < 8;

  // 상태 매핑 함수
  const mapTaskStatus = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      default:
        return '시작 전';
    }
  };

  // STEP 추가 처리
  const handleAddStep = async (stepName: string = '') => {
    if (!canAddStep) return;

    const finalStepName = stepName.trim() || '빈 STEP';

    try {
      await createStepMutation.mutateAsync({
        projectId: parseInt(projectId),
        body: { name: finalStepName },
      });

      // 성공 시 입력 필드 초기화
      setNewStepName('');
      setIsAddingStep(false);
    } catch (error) {
      console.error('STEP 생성 실패:', error);
      alert('STEP 생성에 실패했습니다.');
    }
  };

  // STEP 추가 모드 토글
  const toggleAddStepMode = () => {
    if (canAddStep) {
      setIsAddingStep(!isAddingStep);
      if (!isAddingStep) {
        setNewStepName('');
      }
    }
  };

  // 포커스 아웃 시 자동 저장
  const handleBlur = () => {
    handleAddStep(newStepName);
  };

  // TODO: 실제로는 step 삭제 로직을 구현해야 함
  const handleDeleteStep = (stepId: number) => {
    alert(`STEP ${stepId} 삭제!`);
  };

  // 드래그가 끝났을 때 호출되는 함수
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

    // TODO: Task 이동 API 호출 구현
    console.log('Task 이동:', {
      sourceStepId,
      destStepId,
      sourceIndex: source.index,
      destIndex: destination.index,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem]">
        {steps.map((step) => (
          <div key={step.stepId} className="flex flex-col">
            <StepHeader
              stepName={step.stepName}
              isOpen={openStepIds.includes(step.stepId)}
              onToggle={() => toggleStep(step.stepId)}
              showDelete={step.tasks.length === 0}
              onDelete={() => handleDeleteStep(step.stepId)}
            />
            {openStepIds.includes(step.stepId) && (
              <Droppable droppableId={step.stepId.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col mt-6 min-h-[0.625rem]"
                  >
                    {step.tasks.map((task, idx) => (
                      <Draggable
                        key={`${step.stepId}-${task.taskId}`}
                        draggableId={task.taskId.toString()}
                        index={idx}
                      >
                        {(provided, snapshot) => (
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
                                id={task.taskId}
                                title={task.taskName}
                                status={mapTaskStatus(task.status)}
                                deadline={task.deadline}
                                assignee={task.managers.map((manager) => manager.userName)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    <div className="mt-2">
                      <AddTaskButton stepName={step.stepName} />
                    </div>
                  </div>
                )}
              </Droppable>
            )}
          </div>
        ))}

        {/* STEP 추가 버튼 */}
        {canAddStep && (
          <div className="flex flex-col">
            <div className="flex bg-[#DAF3F3] w-full h-[4.25rem] items-center justify-between rounded-[0.5rem]">
              {isAddingStep ? (
                <input
                  type="text"
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  placeholder="STEP 이름을 입력하세요"
                  className="flex-1 mx-auto text-center font-medium text-[1.125rem] bg-transparent border-none outline-none placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddStep(newStepName);
                    }
                  }}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                <button
                  onClick={toggleAddStepMode}
                  className="w-full h-full font-medium text-[1.125rem] transition-colors duration-200 text-[#898989] cursor-pointer hover:text-[#666666]"
                >
                  + STEP 추가
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}
