import { ApiResponse, ApiErrorResponse } from './error';
import { Step } from './steps';
import { Task } from './tasks';

// 대시보드 조회 요청 타입
export interface GetDashboardRequest {
  projectId: number;
  view: 'step' | 'status';
}

// 상태별 그룹 타입
export interface StatusGroup {
  status: 'NOTSTART' | 'ONGOING' | 'COMPLETED';
  tasks: Task[];
}

// STEP 뷰 응답 타입
export interface StepViewResponse {
  projectId: number;
  projectName: string;
  steps: Step[];
  totalCount: number;
}

// STATUS 뷰 응답 타입
export interface StatusViewResponse {
  projectId: number;
  projectName: string;
  statusGroups: StatusGroup[];
  totalCount: number;
}

// 대시보드 응답 타입 (유니온 타입)
export type DashboardResponse = StepViewResponse | StatusViewResponse;
