import TaskItem from '@/components/TaskItem';
import { STATUS_ORDER } from '@/constants/constants';
import { StatusBoardProps } from '@/types/board';
import { Task } from '@/types/api/tasks';
import { useUpdateTaskStatus } from '@/hooks/mutations/useUpdateTaskStatus';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';
import CopyModal from '@/components/CopyModal';
import Portal from '@/components/Portal';
import Link from 'next/link';

export default function StatusBoard({ statusGroups, projectId, isCompleted }: StatusBoardProps) {
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [completedTask, setCompletedTask] = useState<{ title: string; taskId: number } | null>(
    null
  );

  // API 상태를 표시 상태로 변환
  const getDisplayStatus = (apiStatus: string) => {
    switch (apiStatus) {
      case 'ONGOING':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      case 'NOTSTART':
        return '시작 전';
      default:
        return '시작 전';
    }
  };

  // 표시 상태를 API 상태로 변환
  const getApiStatus = (displayStatus: string): 'ONGOING' | 'COMPLETED' | 'NOTSTART' => {
    switch (displayStatus) {
      case '진행 중':
        return 'ONGOING';
      case '완료':
        return 'COMPLETED';
      case '시작 전':
        return 'NOTSTART';
      default:
        return 'NOTSTART';
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
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // 같은 상태로 이동하는 경우는 무시
    if (sourceStatus === destStatus) {
      return;
    }

    // 드래그된 task 찾기
    const sourceStatusGroup = statusGroups.find(
      (group) => getDisplayStatus(group.status) === sourceStatus
    );
    if (!sourceStatusGroup) return;

    const draggedTask = sourceStatusGroup.tasks[source.index];
    if (!draggedTask) return;

    try {
      // 새로운 상태로 변경
      const newStatus = getApiStatus(destStatus);
      await updateTaskStatusMutation.mutateAsync({
        taskId: draggedTask.taskId,
        status: newStatus,
      });

      // 완료 상태로 변경된 경우 모달 표시
      if (newStatus === 'COMPLETED') {
        setCompletedTask({
          title: draggedTask.taskName,
          taskId: draggedTask.taskId,
        });
        setShowCopyModal(true);
      }

      console.log('Task 상태 변경 성공:', {
        taskId: draggedTask.taskId,
        fromStatus: sourceStatus,
        toStatus: destStatus,
        newApiStatus: newStatus,
      });
    } catch (error) {
      console.error('Task 상태 변경 실패:', error);
      alert('업무 상태 변경에 실패했습니다.');
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

  // 복사될 링크 URL
  const getTaskUrl = (taskId: number) => {
    return `/projects/${projectId}/tasks/${taskId}`;
  };

  // 클립보드에 복사될 순수 텍스트
  const getTextToCopy = (title: string, taskId: number) =>
    `💼 ${title} 업무가 완료되었어요!\n확인 후 간단한 피드백을 남겨주세요.\n👉 ${getTaskUrl(taskId)}`;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem]">
        {STATUS_ORDER.map(({ status, color }) => {
          // 해당 상태의 업무들 필터링
          const tasksByStatus = allTasksWithStatus.filter((task) => task.displayStatus === status);

          return (
            <div key={status} className="flex flex-col">
              <div
                className="w-full h-[4.25rem] flex items-center justify-center rounded-[0.5rem] font-medium text-[1.125rem]"
                style={{ backgroundColor: color }}
              >
                {status}
              </div>

              <Droppable droppableId={status} isDropDisabled={isCompleted}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="mt-4 space-y-3"
                    style={{ overflow: 'visible' }}
                  >
                    {tasksByStatus.map((task, index) => (
                      <Draggable
                        key={task.taskId}
                        draggableId={task.taskId.toString()}
                        index={index}
                        isDragDisabled={isCompleted}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'opacity-50 z-50' : ''}`}
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
                                status={task.displayStatus}
                                deadline={task.deadline}
                                assignee={task.managers.map((manager) => ({
                                  name: manager.name,
                                  imageUrl: manager.imageUrl,
                                }))}
                                isCompleted={isCompleted}
                                onTaskComplete={(taskId, title) => {
                                  // 프로젝트가 종료된 경우 완료 처리 비활성화
                                  if (isCompleted) return;

                                  // 완료 상태로 변경된 경우 모달 표시
                                  setCompletedTask({ title, taskId });
                                  setShowCopyModal(true);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
      {showCopyModal && completedTask && (
        <Portal>
          <CopyModal
            isOpen={showCopyModal}
            onClose={() => setShowCopyModal(false)}
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
    </DragDropContext>
  );
}
