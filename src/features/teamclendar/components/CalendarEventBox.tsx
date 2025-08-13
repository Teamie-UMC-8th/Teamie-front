export default function CalendarEventBox({ event }: { event: { title?: string } }) {
  return (
    <div className=" w-full h-full rounded-[4px] px-[22px] py-[4px] text-[16px] leading-[24px] text-black overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-center">
      {event.title || '빈 일정'}
    </div>
  );
}
