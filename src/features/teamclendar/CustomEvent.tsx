interface CustomEventProps {
  event: {
    title: string;
  };
}

export default function CustomEvent({ event }: CustomEventProps) {
  return (
    <div
      className="bg-[#B6F5DF] rounded-[6px] px-[16px] py-[8px] text-[14px] font-normal
                 leading-[20px] text-black whitespace-pre-wrap"
    >
      {event.title}
    </div>
  );
}
