'use client';

interface RemindMessageButtonProps {
  onClick: () => void;
}

export default function RemindMessageButton({ onClick }: RemindMessageButtonProps) {
  return (
    <div className="flex justify-end mt-[12px]">
      <div
        className="bg-[#81D7D4] w-[138px] h-[34px] rounded-[4px] text-white font-bold px-[12px] py-[4px] text-[18px] cursor-pointer"
        onClick={onClick}
      >
        리마인드 메세지
      </div>
    </div>
  );
}
