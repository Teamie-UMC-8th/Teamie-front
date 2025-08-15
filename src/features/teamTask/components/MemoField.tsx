interface MemoFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
}

export default function MemoField({ value, onChange, onBlur }: MemoFieldProps) {
  return (
    <div className="flex flex-row mt-[40px] ml-[40px] w-[1415px] max-lg:ml-[24px]">
      <div className="min-w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
        비고
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        className="w-[1290px] min-w-[1109px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] max-lg:w-[738px] max-lg:h-[72px] max-lg:min-w-[735px] resize-none"
      />
    </div>
  );
}
