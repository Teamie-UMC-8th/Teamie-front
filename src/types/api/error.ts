// API 에러 응답 타입
export interface ApiErrorResponse {
  errorCode: string;
  reason: string;
  data: { projectId: string } | null;
}

// 공통 API 응답 래퍼 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: T | null;
}
