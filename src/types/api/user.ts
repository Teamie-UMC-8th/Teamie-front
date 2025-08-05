import { ApiErrorResponse } from './error';

export interface UserProject {
  id: string;
  name: string;
  permission: string;
}

export interface UserProfile {
  imageUrl: string;
  name: string;
  school: string | null;
  major: string | null;
  email: string;
  projectNum: number;
  permission: string; // 사용자 권한 (LEAD, MEMBER 등)
  projects: UserProject[]; // 사용자가 속한 프로젝트 목록
}

// 사용자 프로필 API 응답 구조
export interface UserResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: UserProfile | null;
}

// 사용자 프로젝트 API 응답 구조
export interface UserProjectsResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: UserProject[] | null;
}

// 사용자 프로필 수정 API 요청 파라미터
export interface UpdateUserProfileParams {
  school?: string;
  major?: string;
  file?: File;
}

// 주요 업무 수정 API 요청 파라미터
export interface UpdateMainTaskParams {
  mainTask: string;
}

// 주요 업무 수정 API 응답 구조
export interface UpdateMainTaskResponse {
  isSuccess: boolean;
  error: null;
  result: {
    portfolioId: number;
    projectName: string;
    category: string;
    contributionRate: number;
    startDate: string;
    endDate: string;
    mainTask: string;
  };
}
