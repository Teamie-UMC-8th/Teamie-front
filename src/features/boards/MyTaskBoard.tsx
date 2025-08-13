import { useEffect, useState } from 'react';
import TaskItem from '@/components/TaskItem';
import ProjectHeader from './components/ProjectHeader';
import { useGetMyTasks } from '@/hooks/queries/useGetMyTasks';

export default function MyTaskBoard() {
  const { data, isLoading } = useGetMyTasks();
  const projects = data?.result?.data ?? [];

  const [openProjectIds, setOpenProjectIds] = useState<string[]>([]);

  useEffect(() => {
    if (projects.length > 0) {
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

  if (isLoading) {
    return <div className="mt-10 text-center">불러오는 중...</div>;
  }

  return (
    <div
      className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem] min-w-[64rem] overflow-x-auto"
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
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
