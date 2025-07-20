import { useState } from 'react';
import TaskItem from '@/components/TaskItem';
import { mockProjects } from '@/constants/mockData';
import ProjectHeader from './components/ProjectHeader';

// 임시 로그인 사용자
const currentUser = '홍길동';

export default function MyTaskBoard() {
  // 프로젝트별로, 모든 step의 items 중 담당자가 currentUser인 태스크만 한 배열로 합침
  const filteredProjects = mockProjects.map((project) => ({
    ...project,
    myTasks: project.steps
      .flatMap((step) => step.items)
      .filter((task) => task.assignee && task.assignee.includes(currentUser)),
  }));

  // 아코디언 상태 관리 (기본: 모두 펼침)
  const [openProjectIds, setOpenProjectIds] = useState<string[]>(filteredProjects.map((p) => p.id));

  const handleToggle = (projectId: string) => {
    setOpenProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  return (
    <div
      className="grid [grid-template-columns:repeat(2,20.313rem)] lg:[grid-template-columns:repeat(4,20.313rem)] gap-x-[2.25rem] gap-y-[5rem] mt-[3.75rem] min-w-[64rem] overflow-x-auto"
      style={{
        paddingLeft: 'clamp(43px, calc(112px - ((100vw - 1024px) * 0.077)), 112px)',
      }}
    >
      {filteredProjects.map((project) => (
        <div key={project.id}>
          <ProjectHeader
            projectName={project.name}
            isOpen={openProjectIds.includes(project.id)}
            onToggle={() => handleToggle(project.id)}
          />
          {openProjectIds.includes(project.id) && (
            <div className="flex flex-col gap-3 mt-[1.5rem]">
              {project.myTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  projectId={project.id}
                  id={task.id}
                  title={task.title}
                  status={task.status}
                  deadline={task.deadline}
                  assignee={task.assignee}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
