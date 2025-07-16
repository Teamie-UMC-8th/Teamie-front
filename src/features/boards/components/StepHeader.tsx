import { useState } from 'react';

interface StepHeaderProps {
  stepName: string;
  isOpen: boolean;
  onToggle: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
}

export default function StepHeader({
  stepName,
  isOpen,
  onToggle,
  showDelete,
  onDelete,
}: StepHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleIconClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={onToggle} className="cursor-pointer w-full">
        <div className="flex bg-[#DAF3F3] w-[325px] h-[68px] items-center justify-between rounded-[8px]">
          <span className="font-medium text-[18px] mx-auto">{stepName}</span>
          {showDelete && isHovered ? (
            <span
              className="w-[32px] h-[32px] mr-[4px] flex items-center justify-center"
              onClick={handleIconClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleIconClick(e);
              }}
            >
              <img src="/icons/delete_steps.svg" alt="delete step" className="w-6 h-6" />
            </span>
          ) : (
            <img
              src="/icons/arrow-down.svg"
              className={`w-[32px] h-[32px] mr-[4px] ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </button>
    </div>
  );
}
