interface StepHeaderProps {
  stepName: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function StepHeader({ stepName, isOpen, onToggle }: StepHeaderProps) {
  return (
    <div className="flex bg-[#DAF3F3] w-[325px] h-[68px] items-center justify-between rounded-[8px]">
      <span className="font-medium text-[18px] mx-auto">{stepName}</span>
      <button onClick={onToggle}>
        <img
          src="/icons/arrow-down.svg"
          className={`w-[32px] h-[32px] mr-[4px] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}
