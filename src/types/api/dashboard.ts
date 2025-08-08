import { ApiResponse, ApiErrorResponse } from './error';

// ===== 대시보드 조회 관련 타입 =====

// 대시보드 조회 요청 타입
export interface GetDashboardRequest {
  projectId: number;
  view: 'step' | 'status';
}

// 대시보드 응답 타입
export interface DashboardResponse {
  projectId: number;
  projectName: string;
  steps: Step[];
  totalCount: number;
}

// ===== STEP 관련 타입 =====

// STEP 생성 요청 타입
export interface CreateStepRequest {
  projectId: number;
  name: string;
}

// STEP 생성 응답 타입
export interface CreateStepResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    stepId: number;
    name: string;
  } | null;
}

// STEP 수정 요청 타입
export interface UpdateStepRequest {
  stepId: number;
  name: string;
}

// STEP 수정 응답 타입 (CreateStepResponse와 동일)
export type UpdateStepResponse = CreateStepResponse;

// STEP 삭제 응답 타입
export interface DeleteStepResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: string | null; // "step 삭제 성공" 메시지
}

// ===== TASK 관련 타입 =====

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

// ===== 공통 타입 =====

// 단계 타입
export interface Step {
  stepId: number;
  stepName: string;
  tasks: Task[];
}

// 업무 타입
export interface Task {
  taskId: number;
  taskName: string;
  status: 'ONGOING' | 'COMPLETED' | 'PENDING';
  managers: Manager[];
  deadline: string;
}

// 담당자 타입
export interface Manager {
  userId: number;
  userName: string;
}
