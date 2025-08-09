import { useMemo } from 'react';
import { UseTaskItemsProps, UseTaskItemsReturn } from '@/types/api/tasks';

export const useTaskItems = ({ task }: UseTaskItemsProps): UseTaskItemsReturn => {
  // 마감기한이 경과했는지 확인 (완료 상태가 아닌 경우에만)
  const isDeadlineOverdue = useMemo(() => {
    if (!task.deadline || task.status === '완료') return false;
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    return deadlineDate < today;
  }, [task.deadline, task.status]);

  // 담당자 표시 로직 (최대 3명 + ...)
  const displayAssignees = useMemo(() => {
    if (!task.assignee || task.assignee.length === 0) return null;

    const maxDisplay = 3;
    const displayList = task.assignee.slice(0, maxDisplay);
    const hasMore = task.assignee.length > maxDisplay;

    return {
      displayList,
      hasMore,
      totalCount: task.assignee.length,
    };
  }, [task.assignee]);

  // 카드 높이 조정 (담당자가 없으면 더 작게)
  const cardHeight = useMemo(() => {
    return task.assignee && task.assignee.length > 0 ? 'h-[122px]' : 'h-[90px]';
  }, [task.assignee]);

  // 마감기한 텍스트 색상 결정
  const deadlineTextColor = useMemo(() => {
    if (!task.deadline) return 'text-[#898989]';
    return isDeadlineOverdue ? 'text-red-500' : 'text-[#898989]';
  }, [task.deadline, isDeadlineOverdue]);

  return {
    isDeadlineOverdue,
    displayAssignees,
    cardHeight,
    deadlineTextColor,
  };
};
