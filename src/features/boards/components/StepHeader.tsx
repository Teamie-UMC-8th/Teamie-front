interface StepHeaderProps {
  stepName: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function StepHeader({ stepName, isOpen, onToggle }: StepHeaderProps) {
  return (
    <button onClick={onToggle} className="cursor-pointer">
      <div className="flex bg-[#DAF3F3] w-[325px] h-[68px] items-center justify-between rounded-[8px]">
        <span className="font-medium text-[18px] mx-auto">{stepName}</span>
        <img
          src="/icons/arrow-down.svg"
          className={`w-[32px] h-[32px] mr-[4px] ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
    </button>
  );
}
