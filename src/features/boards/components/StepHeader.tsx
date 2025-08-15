import { useState } from 'react';
import Image from 'next/image';

interface StepHeaderProps {
  stepName: string;
  stepId: number;
  isOpen: boolean;
  onToggle: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  onUpdateName?: (stepId: number, newName: string) => Promise<void>;
}

export default function StepHeader({
  stepName,
  stepId,
  isOpen,
  onToggle,
  showDelete,
  onDelete,
  onUpdateName,
}: StepHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(stepName);

  const handleIconClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateName) {
      setIsEditing(true);
      setEditName(stepName);
    }
  };

  const handleBlur = async () => {
    if (!onUpdateName) return;

    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== stepName) {
      try {
        await onUpdateName(stepId, trimmedName);
      } catch (error) {
        console.error('스텝 이름 수정 실패:', error);
        setEditName(stepName); // 실패 시 원래 이름으로 복원
      }
    } else {
      setEditName(stepName); // 빈 값이거나 변경사항이 없으면 원래 이름으로 복원
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setEditName(stepName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={onToggle} className="cursor-pointer w-full">
        <div className="relative flex bg-[#DAF3F3] w-full h-[4.25rem] items-center justify-center rounded-[0.5rem]">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              className="absolute inset-0 mx-auto text-center font-medium text-[1.125rem] bg-transparent border-none outline-none"
              autoFocus
            />
          ) : (
            <span
              className="font-medium text-[1.125rem] cursor-pointer"
              onDoubleClick={handleDoubleClick}
            >
              {stepName}
            </span>
          )}
          {showDelete && isHovered ? (
            <span
              className="absolute right-2 w-[2rem] h-[2rem] flex items-center justify-center"
              onClick={handleIconClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleIconClick(e);
              }}
            >
              <Image
                src="/icons/delete_steps.svg"
                alt="delete step"
                className="w-6 h-6"
                width={24}
                height={24}
              />
            </span>
          ) : (
            <Image
              src="/icons/arrow-down.svg"
              alt="arrow-down"
              className={`absolute right-2 w-[2rem] h-[2rem] ${isOpen ? 'rotate-180' : ''}`}
              width={32}
              height={32}
            />
          )}
        </div>
      </button>
    </div>
  );
}
