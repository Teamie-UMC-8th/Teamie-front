import AddProfileButton from '@/components/AddProfileButton';

interface MeetingRecordsFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  availableProfiles: { userId: number; userName: string }[];
  selectedWriters: number[];
  onWritersChange: (selectedUserIds: number[]) => void;
  onPermissionCheck?: () => boolean;
  readOnly?: boolean;
}

export default function MeetingRecordsField({
  value,
  onChange,
  onBlur,
  availableProfiles,
  selectedWriters,
  onWritersChange,
  onPermissionCheck,
  readOnly = false,
}: MeetingRecordsFieldProps) {
  return (
    <div
      className="flex-col mt-[40px] ml-[40px]
    max-lg:ml-[24px]"
    >
      <div className="flex items-center">
        <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
          회의록
        </div>
        <div className="border-l-[2px] border-[#898989] h-[22px]" />
        <p className="text-[18px] ml-[12px] mr-[12px]">기록자</p>
        <div className="border-l-[2px] border-[#898989] h-[22px] mr-[12px]" />
        <AddProfileButton
          profiles={availableProfiles}
          initialSelectedIds={selectedWriters}
          onChange={onWritersChange}
          onPermissionCheck={onPermissionCheck}
        />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        readOnly={readOnly}
        className="w-[1415px] h-[428px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] mt-[15px]
      max-lg:w-[865px] max-lg:min-w-[369px] resize-noneㅣㄴ"
      />
    </div>
  );
}
