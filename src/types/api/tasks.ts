import { ApiErrorResponse } from './error';

// EventTarget 인터페이스 확장 (StepHeader의 blur 메서드 호출을 위해)
declare global {
  interface EventTarget {
    blur(): void;
  }
}

// API용 Task 타입 (완전한 형태)
export interface Task {
  taskId: number;
  taskName: string;
  status: 'ONGOING' | 'COMPLETED' | 'NOTSTART';
  managers: Manager[];
  deadline: string;
}

// 담당자 타입
export interface Manager {
  userId: number;
  name: string;
  imageUrl: string;
}

// TASK 생성 요청 타입
export interface CreateTaskRequest {
  stepId: number;
}

// TASK 생성 응답 타입
export interface CreateTaskResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    taskId: number;
  } | null;
}

// UI용 Task 타입 (간단한 형태)
export interface TaskItem {
  id: number;
  title: string;
  status: string;
  deadline?: string;
  assignee?: { name: string; imageUrl: string }[];
}

// TaskItem 컴포넌트 Props
export type TaskItemProps = TaskItem;

// TaskItem 컴포넌트 Props (projectId 포함)
export interface TaskItemComponentProps extends TaskItemProps {
  projectId: string;
  imageUrl?: string; // 프로필 이미지 URL 추가
}

// useTaskItems 훅 Props
export interface UseTaskItemsProps {
  task: TaskItem;
}

// useTaskItems 훅 반환값
export interface UseTaskItemsReturn {
  isDeadlineOverdue: boolean;
  displayAssignees: {
    displayList: { name: string; imageUrl: string }[]; // string[]에서 객체 배열로 변경
    hasMore: boolean;
    totalCount: number;
  } | null;
  cardHeight: string;
  deadlineTextColor: string;
}

// TASK 상태 매핑 타입
export type TaskStatus = 'NOTSTART' | 'ONGOING' | 'COMPLETE';

// TASK 상태 표시 텍스트 매핑
export const TASK_STATUS_DISPLAY: Record<TaskStatus, string> = {
  NOTSTART: '시작 전',
  ONGOING: '진행 중',
  COMPLETE: '완료',
} as const;

// TASK 상태별 스타일 매핑
export const TASK_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  '진행 중': { bg: 'bg-[#B6F5DF]', text: 'text-[#505050]' },
  완료: { bg: 'bg-[#A1C2ED]', text: 'text-[#505050]' },
  '시작 전': { bg: 'bg-[#E7E7E7]', text: 'text-[#505050]' },
} as const;

export interface MyTaskManager {
  userId: number;
  name: string;
  imageUrl: string;
}

export interface MyTaskTask {
  id: number;
  name: string;
  status: 'ONGOING' | 'COMPLETED' | 'NOTSTART';
  deadline: string;
  managers: MyTaskManager[];
}

export interface MyTaskProject {
  projectId: number;
  projectName: string;
  tasks: MyTaskTask[];
}

export interface MyTaskPageInfo {
  nextCursor: unknown;
  hasNextPage: boolean;
}

export interface MyTaskResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    data: MyTaskProject[];
    pageInfo: MyTaskPageInfo;
  };
}
