import { ApiErrorResponse } from './error';
import { Task } from './tasks';

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

export interface Step {
  stepId: number;
  stepName: string;
  tasks: Task[];
}
