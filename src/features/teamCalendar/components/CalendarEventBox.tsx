'use client';

import { useParams, useRouter } from 'next/navigation';

type CalendarEvent = {
  id?: string | number;
  title?: string;
};

export default function CalendarEventBox({ event }: { event: CalendarEvent }) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId?.toString();
  const isTask = typeof event?.id === 'string' && String(event.id).startsWith('task:');
  const taskId = isTask ? String(event.id).replace('task:', '') : undefined;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (event?.id == null) return;
    // 커스텀 MIME 타입과 텍스트 둘 다 넣어 브라우저/플랫폼 호환성 확보
    if (isTask) {
      const payload = JSON.stringify({ taskId: String(taskId) });
      e.dataTransfer.setData('application/x-teamie-task', payload);
      e.dataTransfer.setData('text/plain', payload);
    } else {
      const payload = JSON.stringify({ planId: String(event.id) });
      e.dataTransfer.setData('application/x-teamie-plan', payload);
      e.dataTransfer.setData('text/plain', payload);
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!projectId || event?.id == null) return;
    const target = isTask
      ? `/projects/${projectId}/tasks/${taskId}`
      : `/projects/${projectId}/teamCalendar/${String(event.id)}/teamTask`;
    console.log('이벤트 클릭: 팀태스크로 이동', {
      projectId,
      id: String(event.id),
      title: event.title,
      target,
    });
    router.push(target);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="relative z-[10] w-full h-full rounded-[4px] px-[22px] py-[4px] text-[16px] leading-[20px] text-black cursor-pointer pointer-events-auto"
      title={event.title ?? ''}
      role="button"
    >
      <div className="w-full h-full flex items-center justify-center text-center break-words whitespace-normal overflow-wrap-anywhere z-[90px]">
        {event.title || '빈 일정'}
      </div>
    </div>
  );
}
