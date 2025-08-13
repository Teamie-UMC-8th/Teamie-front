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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!projectId || event?.id == null) return;
    const target = `/projects/${projectId}/teamcalendar/${String(event.id)}/teamtask`;
    console.log('이벤트 클릭: 팀태스크로 이동', {
      projectId,
      planId: String(event.id),
      title: event.title,
      target,
    });
    router.push(target);
  };

  return (
    <div
      onClick={handleClick}
      className="relative z-[60] w-full h-full rounded-[4px] px-[22px] py-[4px] text-[16px] leading-[24px] text-black overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-center cursor-pointer pointer-events-auto"
      title={event.title ?? ''}
      role="button"
    >
      {event.title || '빈 일정'}
    </div>
  );
}
