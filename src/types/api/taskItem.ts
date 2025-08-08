// TaskItem 컴포넌트 관련 타입 정의

// 기본 Task 인터페이스
export interface Task {
  id: number;
  title: string;
  status: string;
  deadline?: string;
  assignee?: string[];
}

// TaskItem 컴포넌트 Props
export interface TaskItemProps {
  id: number;
  title: string;
  status: string; // 유연성을 위해 string으로 변경
  deadline?: string;
  assignee?: string[];
}

// TaskItem 컴포넌트 Props (projectId 포함)
export interface TaskItemComponentProps extends TaskItemProps {
  projectId: string;
}

// useTaskItems 훅 Props
export interface UseTaskItemsProps {
  task: Task;
}

// useTaskItems 훅 반환값
export interface UseTaskItemsReturn {
  isDeadlineOverdue: boolean;
  displayAssignees: {
    displayList: string[];
    hasMore: boolean;
    totalCount: number;
  } | null;
  cardHeight: string;
  deadlineTextColor: string;
}

// Task 상태 매핑 타입
export type TaskStatus = 'BEFORE' | 'ONGOING' | 'COMPLETE';

// Task 상태 표시 텍스트 매핑
export const TASK_STATUS_DISPLAY: Record<TaskStatus, string> = {
  BEFORE: '시작 전',
  ONGOING: '진행 중',
  COMPLETE: '완료',
} as const;

// Task 상태별 스타일 매핑
export const TASK_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  '진행 중': { bg: 'bg-[#B6F5DF]', text: 'text-[#505050]' },
  완료: { bg: 'bg-[#D1D5DB]', text: 'text-[#505050]' },
  '시작 전': { bg: 'bg-[#E7E7E7]', text: 'text-[#505050]' },
} as const;
