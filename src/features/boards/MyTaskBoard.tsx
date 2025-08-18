import { useEffect, useState, useMemo } from 'react';
import TaskItem from '@/components/TaskItem';
import ProjectHeader from './components/ProjectHeader';
import { useGetMyTasks } from '@/hooks/queries/useGetMyTasks';
import CopyModal from '@/components/CopyModal';
import Portal from '@/components/Portal';
import Link from 'next/link';

export default function MyTaskBoard() {
  const { data, isLoading } = useGetMyTasks();

  // projects 배열을 useMemo로 메모이제이션
  const projects = useMemo(() => {
    return data?.result?.data ?? [];
  }, [data?.result?.data]);

  const [openProjectIds, setOpenProjectIds] = useState<string[]>([]);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [completedTask, setCompletedTask] = useState<{
    title: string;
    taskId: number;
    projectId: string;
  } | null>(null);

  useEffect(() => {
    if (projects.length > 0) {
      // 모든 프로젝트를 기본적으로 펼친 상태로 설정
      setOpenProjectIds(projects.map((p) => String(p.projectId)));
    }
  }, [projects]);

  const handleToggle = (projectId: string) => {
    setOpenProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      case 'NOTSTART':
      default:
        return '시작 전';
    }
  };

  // 업무 완료 시 호출되는 콜백 함수
  const handleTaskComplete = (taskId: number, title: string, projectId: string) => {
    setCompletedTask({ taskId, title, projectId });
    setShowCopyModal(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowCopyModal(false);
    setCompletedTask(null);
  };

  // 복사될 링크 URL
  const getTaskUrl = (taskId: number, projectId: string) =>
    `http://localhost:3000/projects/${projectId}/tasks/${taskId}`;

  // 클립보드에 복사될 순수 텍스트
  const getTextToCopy = (title: string, taskId: number, projectId: string) =>
    `💼 ${title} 업무가 완료되었어요!\n확인 후 간단한 피드백을 남겨주세요.\n👉 ${getTaskUrl(taskId, projectId)}`;

  if (isLoading) {
    return <div className="mt-10 text-center">불러오는 중...</div>;
  }

  return (
    <>
      <div
        className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem] min-w-[64rem] pb-[5rem]"
        style={{ paddingLeft: 'clamp(43px, calc(112px - ((100vw - 1024px) * 0.077)), 112px)' }}
      >
        {projects.map((project) => (
          <div key={project.projectId}>
            <ProjectHeader
              projectName={project.projectName}
              isOpen={openProjectIds.includes(String(project.projectId))}
              onToggle={() => handleToggle(String(project.projectId))}
            />
            {openProjectIds.includes(String(project.projectId)) && (
              <div className="flex flex-col gap-3 mt-[1.5rem]">
                {project.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    projectId={String(project.projectId)}
                    id={task.id}
                    title={task.name}
                    status={mapStatus(task.status)}
                    deadline={task.deadline}
                    assignee={task.managers.map((m) => ({
                      name: m.name,
                      imageUrl: m.imageUrl,
                    }))}
                    onTaskComplete={(taskId, title) =>
                      handleTaskComplete(taskId, title, String(project.projectId))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

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
                  href={getTaskUrl(completedTask.taskId, completedTask.projectId)}
                  className="underline font-bold text-[#81D7D4]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {completedTask.title}
                </Link>
              </>
            }
            textToCopy={getTextToCopy(
              completedTask.title,
              completedTask.taskId,
              completedTask.projectId
            )}
            copySuccessText="업무 완료 메세지가 복사되었습니다."
            innerPaddingX="5rem"
          />
        </Portal>
      )}
    </>
  );
}
