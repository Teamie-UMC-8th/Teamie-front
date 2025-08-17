import { ApiErrorResponse } from './error';

export interface CreateProjectRequest {
  name: string;
  permission?: string; // 생성자의 권한 (LEAD로 설정)
}

export interface CreateProjectReponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    id: string;
    name: string;
    inviteCode: string;
    expiresAt: string;
  } | null;
}

export interface GetJoinProjectRequest {
  inviteCode: string;
}

export interface GetJoinProjectResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    projectId: number; // id → projectId로 변경
    name: string;
    leaderName: string; // leader → permission으로 변경
  } | null;
}

export interface PostJoinProjectRequest {
  projectId: number;
}

export interface PostJoinProjectResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result?: {
    message?: string;
  } | null;
}

export interface UserProjectPermissionResponse {
  isSuccess: boolean;
  error: null | string;
  result: {
    permission: 'LEAD' | 'MEMBER';
  };
}

// 프로젝트 완료 API 응답 타입
export interface CompleteProjectResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    id: number;
    isCompleted: boolean;
    completedAt: string;
  } | null;
}

// 프로젝트 종료 여부 조회 응답 타입
export interface GetProjectIsCompletedResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    isCompleted: boolean | number; // 서버는 0/1을 줄 수 있으므로 number 허용
  } | null;
}
