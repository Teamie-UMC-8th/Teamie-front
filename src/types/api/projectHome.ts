/**
 * 프로젝트 사용자 정보 타입
 */
export interface ProjectUser {
  id: number;
  name: string;
  email: string;
  school: string;
  imageUrl: string | null;
  permission: string;
  role: string;
  tasks: any[];
}

/**
 * 프로젝트 정보 타입
 */
export interface Project {
  id: number;
  name: string;
  goal: string;
  rule: string;
  users: ProjectUser[];
}

/**
 * 프로젝트 홈 조회 API 응답 타입
 */
export interface ProjectHomeResponse {
  isSuccess: boolean;
  error: {
    errorCode: string;
    reason: string;
    data: any;
  } | null;
  result: {
    project: Project;
    users: ProjectUser[];
  } | null;
}

/**
 * 프로젝트 수정 요청 타입
 */
export interface UpdateProjectRequest {
  name?: string;
  goal?: string;
  rule?: string;
}

/**
 * 프로젝트 수정 API 응답 타입
 */
export interface UpdateProjectResponse {
  isSuccess: boolean;
  error: {
    errorCode: string;
    reason: string;
    data: any;
  } | null;
  result: {
    project: Project;
  } | null;
}

/**
 * 프로젝트 홈 API 에러 타입
 */
export interface ProjectHomeError {
  isSuccess: false;
  error: {
    errorCode: 'FORBIDDEN_USER_FOR_UPDATE' | 'PROJECT_NOT_FOUND';
    reason: string;
    data: null;
  };
  result: null;
}

/**
 * PostIt 데이터 타입
 */
export interface PostItData {
  id: string;
  content: string;
  createdAt: number;
}

/**
 * 팀 멤버 타입
 */
export interface TeamMember {
  id: number;
  name: string;
  university: string;
  email: string;
  role: string;
  isLeader: boolean;
}
