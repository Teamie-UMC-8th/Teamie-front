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
