// 공통 응답 구조 ( discriminated union을 위한 base interface)
interface WebSocketResponseBase<E extends 'plan' | 'task' | 'step' | 'task_file', P> {
  type: 'created' | 'updated' | 'deleted';
  entity: E;
  payload: P;
  timestamp: string; // ISO8601 형식
}

// 타입별 응답 구조 (entity값 고정)
export type PlanResponse = WebSocketResponseBase<
  'plan',
  CreatedPlanDTO | UpdatedPlanDTO | DeletedPlanDTO
>;
export type TaskResponse = WebSocketResponseBase<
  'task',
  CreatedTaskDTO | UpdatedTaskDTO | DeletedTaskDTO
>;
export type StepResponse = WebSocketResponseBase<
  'step',
  CreatedStepDTO | UpdatedStepDTO | DeletedStepDTO
>;

// 모든 응답 타입을 하나로 합칩니다.
export type WebSocketResponseUnion = PlanResponse | TaskResponse | StepResponse;

// 사용자 프로필 타입
export interface UserProfile {
  id: number;
  name: string;
}

// 일정(Plan) 관련 타입들
export interface CreatedPlanDTO {
  id: number;
  date: string; // ISO8601 형식
}

export interface DeletedPlanDTO {
  id: number;
}

export interface UpdatedPlanDTO {
  id: number;
  name?: string;
  date?: string; // ISO8601 형식
  startHour?: string; // HH:MM:SS 형식
  location?: string;
  attendees?: UserProfile[];
  memo?: string;
  writers?: UserProfile[];
  meetingRecords?: string;
}

// 업무(Task) 관련 타입들
export interface CreatedTaskDTO {
  id: number;
  name: string;
  status: 'NOTSTART' | 'ONGOING' | 'COMPLETED';
  deadline: string | null;
  stepId: number;
  managers: UserProfile[];
}

export interface DeletedTaskDTO {
  id: number;
}

export interface UpdatedTaskDTO {
  id: number;
  name?: string;
  status?: 'NOTSTART' | 'ONGOING' | 'COMPLETED';
  deadline?: string | null;
  stepId?: number;
  managers?: UserProfile[];
}

// 스텝(Step) 관련 타입들
export interface CreatedStepDTO {
  id: number;
  name: string;
}

export interface DeletedStepDTO {
  id: number;
}

export interface UpdatedStepDTO {
  id: number;
  name?: string;
}

export interface CreatedTaskFileDTO {
  id: number;
  fileUrl: string;
}

export interface DeletedTaskFileDTO {
  id: number;
}

// 타입별 Payload 유니온 타입
export type WebSocketPayload =
  | CreatedPlanDTO
  | DeletedPlanDTO
  | UpdatedPlanDTO
  | CreatedTaskDTO
  | DeletedTaskDTO
  | UpdatedTaskDTO
  | CreatedStepDTO
  | DeletedStepDTO
  | UpdatedStepDTO
  | CreatedTaskFileDTO
  | DeletedTaskFileDTO;

// 타입 가드 함수들 (Payload 기반 -> Response Wrapper 기반으로 변경)

// 1. Entity 종류에 따라 Response 타입을 좁히는 타입 가드
export const isPlanResponse = (res: WebSocketResponseUnion): res is PlanResponse =>
  res.entity === 'plan';

export const isTaskResponse = (res: WebSocketResponseUnion): res is TaskResponse =>
  res.entity === 'task';

export const isStepResponse = (res: WebSocketResponseUnion): res is StepResponse =>
  res.entity === 'step';

// 2. Action 종류에 따라 Response 타입을 좁히는 제네릭 타입 가드
export const isCreated = <T extends WebSocketResponseUnion>(
  res: T
): res is T & { type: 'created' } => res.type === 'created';

export const isUpdated = <T extends WebSocketResponseUnion>(
  res: T
): res is T & { type: 'updated' } => res.type === 'updated';

export const isDeleted = <T extends WebSocketResponseUnion>(
  res: T
): res is T & { type: 'deleted' } => res.type === 'deleted';

// 이벤트 타입 enum
export enum SubEventType {
  PROJECT_DASHBOARD = 'project:dashboard',
  PROJECT_CALENDER = 'project:calender',
  PLAN_DETAIL = 'plan:notification',
  TASK_DETAIL = 'task:notification',
}

// 구독 요청/해제 타입
export interface SubscribeRequest {
  eventType: SubEventType;
  id: number;
}

// 웹소켓 연결 상태
export interface WebSocketState {
  isConnected: boolean;
  connectionError: string | null;
}
