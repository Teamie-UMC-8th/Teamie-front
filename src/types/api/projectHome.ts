import { ApiErrorResponse } from './error';
import { Task } from './tasks';

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
  tasks: Task[];
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
  error: ApiErrorResponse;
  result: {
    project: Project;
    users: ProjectUser[];
    // 백엔드가 프로젝트 홈 응답에 게시판 포스트 목록을 포함해 내려줄 수 있습니다.
    // 문서 스펙에 맞게 선택 필드로 정의합니다.
    posts?: PostItInfo[];
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
  error: ApiErrorResponse | null;
  result: {
    project: Project;
    // 프로젝트 홈 수정 응답에 포함되는 포스트잇 요약 목록
    posts?: PostItSummary[];
  } | null;
}

// 프로젝트 수정 응답에서 사용하는 포스트잇 요약 타입 (id/createdAt 미포함)
export interface PostItSummary {
  author: number;
  content: string;
}

/**
 * 포스트잇 생성 요청 타입
 */
export interface CreatePostItRequest {
  content: string;
}

/**
 * 포스트잇 정보 타입
 */
export interface PostItInfo {
  id: number;
  author: number; // 백엔드 응답 스펙과 맞춤
  content: string;
  projectId: number;
  createdAt: string;
}

/**
 * 포스트잇 생성 API 응답 타입
 */
export interface CreatePostItResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: PostItInfo | null;
}

/**
 * 포스트잇 목록 조회 API 응답 타입
 */
// 포스트잇 목록 조회 응답 타입은 서버에서 제공될 때 추가하세요.

/**
 * 포스트잇 삭제 API 응답 타입
 */
export interface DeletePostItResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    message: string;
  } | null;
}

/**
 * 팀장 변경 요청 타입
 */
export interface ChangeLeaderRequest {
  newLeaderId: number;
}

/**
 * 팀장 변경 API 응답 타입
 */
export interface ChangeLeaderResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    newLeaderId: number;
    permission: string;
  } | null;
}

/**
 * 프로필 카드 수정 요청 타입
 */
export interface UpdateProfileRequest {
  id: string;
  role: string;
}

/**
 * 프로필 카드 수정 API 응답 타입
 */
export interface UpdateProfileResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    message: string;
  } | null;
}

/**
 * 프로젝트 홈 API 에러 타입
 */
export interface ProjectHomeError {
  isSuccess: false;
  error: ApiErrorResponse;
  result: {
    message: string;
  } | null;
}

/**
 * PostIt 데이터 타입
 */
export interface PostItData {
  id: string;
  content: string;
  createdAt: number;
  serverId?: number;
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

/**
 * 프로젝트 참여 요청 타입
 */
export interface JoinProjectRequest {
  projectId: number;
}

/**
 * 프로젝트 참여 API 응답 타입
 */
export interface JoinProjectResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    message: string;
  } | null;
}
