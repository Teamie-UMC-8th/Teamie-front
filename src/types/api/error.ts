// API 응답의 error 객체 내부 타입
export interface ApiErrorPayload {
  errorCode: string; // 'PROJECT4043' 등
  reason: string; // "유효기간이 지난 url입니다." 등
  data: null; // data가 있을 경우를 대비
}

// 실패했을 때의 전체 API 응답 타입
export interface ApiErrorResponse {
  isSuccess: false;
  error: ApiErrorPayload;
  result: {
    project?: {
      id?: string;
      name?: string;
      leader?: string;
    };
  };
}
