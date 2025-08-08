import { useState } from 'react';

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
        <div className="flex bg-[#DAF3F3] w-full h-[4.25rem] items-center justify-between rounded-[0.5rem]">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              className="flex-1 mx-auto text-center font-medium text-[1.125rem] bg-transparent border-none outline-none"
              autoFocus
            />
          ) : (
            <span
              className="font-medium text-[1.125rem] mx-auto cursor-pointer"
              onDoubleClick={handleDoubleClick}
            >
              {stepName}
            </span>
          )}
          {showDelete && isHovered ? (
            <span
              className="w-[2rem] h-[2rem] mr-[0.25rem] flex items-center justify-center"
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
              className={`w-[2rem] h-[2rem] mr-[0.25rem] ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </button>
    </div>
  );
}
