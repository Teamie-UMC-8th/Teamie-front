import { useState } from 'react';
import Image from 'next/image';
import { Task } from '@/types/api/tasks';

interface StepHeaderProps {
  step: {
    stepName: string;
    stepId: number;
    tasks: Task[];
  };
  isOpen: boolean;
  onToggle: () => void;
  onDelete: (stepId: number) => void;
  onUpdate: (stepId: number, newName: string) => Promise<void>;
  isCompleted: boolean;
}

export default function StepHeader({
  step,
  isOpen,
  onToggle,
  onDelete,
  onUpdate,
  isCompleted,
}: StepHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(step.stepName);

  const handleIconClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onDelete && !isCompleted) onDelete(step.stepId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      setIsEditing(true);
      setEditName(step.stepName);
    }
  };

  const handleBlur = async () => {
    if (!onUpdate || isCompleted) return;

    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== step.stepName) {
      try {
        await onUpdate(step.stepId, trimmedName);
      } catch (error) {
        console.error('스텝 이름 수정 실패:', error);
        setEditName(step.stepName); // 실패 시 원래 이름으로 복원
      }
    } else {
      setEditName(step.stepName); // 빈 값이거나 변경사항이 없으면 원래 이름으로 복원
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setEditName(step.stepName);
      setIsEditing(false);
    }
  };

  // 삭제 가능 여부 (업무가 없고 프로젝트가 종료되지 않은 경우)
  const showDelete = step.tasks.length === 0 && !isCompleted;

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
              className="w-full h-full text-center font-medium text-[1.125rem] bg-transparent border-none outline-none"
              autoFocus
            />
          ) : (
            <span
              className={`font-medium text-[1.125rem] ${!isCompleted ? 'cursor-pointer' : 'cursor-default'}`}
              onDoubleClick={handleDoubleClick}
            >
              {step.stepName}
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
