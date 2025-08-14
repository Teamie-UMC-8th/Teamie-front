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
    if (event?.id == null || isTask) return; // 업무 카드는 드래그 금지
    // 커스텀 MIME 타입과 텍스트 둘 다 넣어 브라우저/플랫폼 호환성 확보
    const payload = JSON.stringify({ planId: String(event.id) });
    e.dataTransfer.setData('application/x-teamie-plan', payload);
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!projectId || event?.id == null) return;
    const target = isTask
      ? `/projects/${projectId}/tasks/${taskId}`
      : `/projects/${projectId}/teamcalendar/${String(event.id)}/teamtask`;
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
      draggable={!isTask}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="relative z-[60] w-full h-full rounded-[4px] px-[22px] py-[4px] text-[16px] leading-[24px] text-black overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-center cursor-pointer pointer-events-auto"
      title={event.title ?? ''}
      role="button"
    >
      {event.title || '빈 일정'}
    </div>
  );
}
