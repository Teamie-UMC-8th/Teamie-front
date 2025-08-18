import { useCreateStep } from '@/hooks/mutations/useCreateStep';
import { useDeleteStep } from '@/hooks/mutations/useDeleteStep';
import { useUpdateStep } from '@/hooks/mutations/useUpdateStep';
import { useUpdateTaskStep } from '@/hooks/mutations/useUpdateTaskStep';
import { TASK_STATUS_DISPLAY } from '@/types/api/tasks';
import { StepsBoardProps } from '@/types/board';
import { useSteps } from './hooks/useSteps';
import AddTaskButton from './components/AddTaskButton';
import StepHeader from './components/StepHeader';
import TaskItem from '@/components/TaskItem';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';
import CopyModal from '@/components/CopyModal';
import Portal from '@/components/Portal';
import Link from 'next/link';

export default function StepsBoard({ steps, projectId, isCompleted }: StepsBoardProps) {
  const { openStepIds, toggleStep, openStep } = useSteps();
  const createStepMutation = useCreateStep();
  const deleteStepMutation = useDeleteStep();
  const updateStepMutation = useUpdateStep();
  const updateTaskStepMutation = useUpdateTaskStep();

  // 모달 상태 관리
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [completedTask, setCompletedTask] = useState<{ title: string; taskId: number } | null>(
    null
  );

  // STEP 추가 제한 (최대 8개, 프로젝트 종료 시 비활성화)
  const canAddStep = steps.length < 8 && !isCompleted;

  // 상태 매핑 함수 (API 상태를 표시 텍스트로 변환)
  const mapTaskStatus = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return TASK_STATUS_DISPLAY.ONGOING;
      case 'COMPLETED':
        return TASK_STATUS_DISPLAY.COMPLETE;
      default:
        return TASK_STATUS_DISPLAY.NOTSTART;
    }
  };

  // 업무 완료 시 호출되는 콜백 함수
  const handleTaskComplete = (taskId: number, title: string) => {
    setCompletedTask({ taskId, title });
    setShowCopyModal(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowCopyModal(false);
    setCompletedTask(null);
  };

  // 복사될 링크 URL
  const getTaskUrl = (taskId: number) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/projects/${projectId}/tasks/${taskId}`;
  };

  // 클립보드에 복사될 순수 텍스트
  const getTextToCopy = (title: string, taskId: number) =>
    `💼 ${title} 업무가 완료되었어요!\n확인 후 간단한 피드백을 남겨주세요.\n👉 ${getTaskUrl(taskId)}`;

  // STEP 추가 처리
  const handleAddStep = async () => {
    if (!canAddStep || isCompleted) return;

    try {
      const response = await createStepMutation.mutateAsync({
        projectId: parseInt(projectId),
        name: '빈 STEP',
      });

      // 새로 생성된 스텝을 자동으로 열기
      if (response.result?.stepId) {
        openStep(response.result.stepId);
      }
    } catch (error) {
      console.error('STEP 생성 실패:', error);
      alert('STEP 생성에 실패했습니다.');
    }
  };

  // STEP 삭제 처리
  const handleDeleteStep = async (stepId: number) => {
    // 프로젝트가 종료된 경우 삭제 비활성화
    if (isCompleted) return;

    // if (!confirm('정말로 이 STEP을 삭제하시겠습니까?')) {
    //   return;
    // }

    try {
      await deleteStepMutation.mutateAsync(stepId);
      // 성공 시 쿼리 무효화로 자동으로 데이터가 업데이트됩니다
    } catch (error) {
      console.error('STEP 삭제 실패:', error);
      alert('STEP 삭제에 실패했습니다.');
    }
  };

  // STEP 이름 수정 처리
  const handleUpdateStepName = async (stepId: number, newName: string) => {
    try {
      await updateStepMutation.mutateAsync({ stepId, name: newName });
      // 성공 시 쿼리 무효화로 자동으로 데이터가 업데이트됩니다
    } catch (error) {
      console.error('STEP 이름 수정 실패:', error);
      throw error; // StepHeader에서 처리하도록 에러를 다시 던짐
    }
  };

  // 드래그가 끝났을 때 호출되는 함수
  const onDragEnd = async (result: DropResult) => {
    // 프로젝트가 종료된 경우 DnD 비활성화
    if (isCompleted) return;

    const { source, destination } = result;

    // 드롭할 위치가 없으면 아무것도 안 함
    if (!destination) return;

    // source, destination: { droppableId, index }
    const sourceStepId = Number(source.droppableId);
    const destStepId = Number(destination.droppableId);

    // 같은 step으로 이동하는 경우는 무시
    if (sourceStepId === destStepId) {
      return;
    }

    // 드래그된 task 찾기
    const sourceStep = steps.find((step) => step.stepId === sourceStepId);
    if (!sourceStep) return;

    const draggedTask = sourceStep.tasks[source.index];
    if (!draggedTask) return;

    try {
      // 다른 step으로 이동하는 경우만 처리
      await updateTaskStepMutation.mutateAsync({
        stepId: sourceStepId,
        taskId: draggedTask.taskId,
        data: { newStepId: destStepId },
      });

      console.log('Task step 이동 성공:', {
        taskId: draggedTask.taskId,
        fromStepId: sourceStepId,
        toStepId: destStepId,
      });
    } catch (error) {
      console.error('Task 이동 실패:', error);
      alert('업무 이동에 실패했습니다.');
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem]"
          style={{ overflow: 'visible' }}
        >
          {steps.map((step) => (
            <div key={step.stepId} className="flex flex-col">
              <StepHeader
                step={step}
                isOpen={openStepIds.includes(step.stepId)}
                onToggle={() => toggleStep(step.stepId)}
                onDelete={handleDeleteStep}
                onUpdate={handleUpdateStepName}
                isCompleted={isCompleted}
              />

              {openStepIds.includes(step.stepId) && (
                <Droppable droppableId={step.stepId.toString()} isDropDisabled={isCompleted}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="mt-4 space-y-3"
                      style={{ overflow: 'visible' }}
                    >
                      {step.tasks.map((task, idx) => (
                        <Draggable
                          key={`${step.stepId}-${task.taskId}`}
                          draggableId={task.taskId.toString()}
                          index={idx}
                          isDragDisabled={isCompleted}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`mb-3 last:mb-0 transition-all duration-200 ${snapshot.isDragging ? 'opacity-50 z-50' : ''}`}
                              style={{
                                ...provided.draggableProps.style,
                                width: '325px',
                                height: 'auto',
                              }}
                            >
                              <div {...provided.dragHandleProps}>
                                <TaskItem
                                  projectId={String(projectId)}
                                  id={task.taskId}
                                  title={task.taskName}
                                  status={mapTaskStatus(task.status)}
                                  deadline={task.deadline}
                                  assignee={task.managers.map((manager) => ({
                                    name: manager.name,
                                    imageUrl: manager.imageUrl,
                                  }))}
                                  isCompleted={isCompleted}
                                  onTaskComplete={(taskId, title) => {
                                    // 프로젝트가 종료된 경우 완료 처리 비활성화
                                    if (isCompleted) return;
                                    handleTaskComplete(taskId, title);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}

                      <div className="mt-2">
                        <AddTaskButton
                          stepId={step.stepId}
                          stepName={step.stepName}
                          isCompleted={isCompleted}
                        />
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
              <div className="flex bg-[#F8F8F8] w-full h-[4.25rem] items-center justify-center rounded-[0.5rem]">
                <button
                  onClick={handleAddStep}
                  className="w-full h-full font-medium text-[1.125rem] transition-colors duration-200 text-[#898989] cursor-pointer hover:text-[#666666]"
                >
                  + STEP 추가
                </button>
              </div>
            </div>
          )}
        </div>
      </DragDropContext>

      {/* CopyModal */}
      {showCopyModal && completedTask && (
        <Portal>
          <CopyModal
            isOpen={showCopyModal}
            onClose={handleCloseModal}
            headerText="업무가 완료되었습니다.<br>피드백 요청을 위한 메세지를 복사하여<br>팀원들에게 전달하세요."
            messageContent={
              <>
                💼 {completedTask.title} 업무가 완료되었어요!
                <br />
                확인 후 간단한 피드백을 남겨주세요.
                <br />
                👉{' '}
                <Link
                  href={getTaskUrl(completedTask.taskId)}
                  className="underline font-bold text-[#81D7D4]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {completedTask.title}
                </Link>
              </>
            }
            textToCopy={getTextToCopy(completedTask.title, completedTask.taskId)}
            copySuccessText="업무 완료 메세지가 복사되었습니다."
            innerPaddingX="5rem"
          />
        </Portal>
      )}
    </>
  );
}
