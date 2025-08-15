// 로그아웃 API 응답 타입
export interface LogoutResponse {
  isSuccess: boolean;
  error: {
    errorCode: string;
    reason: string;
    data: null;
  } | null;
  result: string;
}
