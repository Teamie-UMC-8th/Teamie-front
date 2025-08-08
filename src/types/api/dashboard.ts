import { ApiResponse, ApiErrorResponse } from './error';
import { Step } from './steps';

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
