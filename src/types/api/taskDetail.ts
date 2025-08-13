import { ApiErrorResponse } from './error';

// 공통 타입 정의
export interface Manager {
  userId: number;
  userName: string;
}

export interface FileItem {
  id: number;
  fileUrl: string;
}

// 업무 상세 조회 API 응답 타입 정의
export interface TaskDetailResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    name: string;
    deadline: string; // 예: '2024-07-10 00:00:00 ' (끝에 공백 포함)
    status: 'ONGOING' | 'COMPLETED' | 'NOTSTART';
    memo: string;
    managers: Manager[];
    files: FileItem[];
    stepId: number;
  } | null;
}

// 업무 수정 API 요청 타입 정의
export interface UpdateTaskRequest {
  name: string;
  deadline: string; // 예: '2024-07-10 00:00:00'
  status: 'ONGOING' | 'COMPLETED' | 'NOTSTART'; // API 응답에 맞춰 COMPLETE로 수정
  memo: string;
  managerIds: number[];
  existingFileUrls: string[];
  stepId: number;
}

// 업무 수정 API 응답 타입 정의
export interface UpdateTaskResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    name: string;
    deadline: string;
    status: 'ONGOING' | 'COMPLETED' | 'NOTSTART'; // API 응답에 맞춰 COMPLETE로 수정
    memo: string;
    managers: Manager[];
    stepId: number;
  };
}

// 업무 삭제 API 응답 타입 정의 (API 문서에 맞춰 수정)
export interface DeleteTaskResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    message: string; // "업무가 성공적으로 삭제되었습니다."
    taskId: number; // 삭제된 업무의 ID (number로 수정)
  };
}
