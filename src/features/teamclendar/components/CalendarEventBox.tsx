export default function CalendarEventBox({ event }: { event: { title: string } }) {
  return (
    <div
      className="bg-[#B6F5DF] w-full h-full rounded-[4px] px-[22px] py-[4px] text-sm text-black overflow-hidden whitespace-nowrap text-ellipsis"
    >
      {event.title}
    </div>
  );
}
