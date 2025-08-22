import axiosInstance from '@/lib/axiosInstance';

// 토큰 재발급 API 응답 타입
interface RefreshResponse {
  isSuccess: boolean;
  error: {
    errorCode: string;
    reason: string;
    data: null;
  } | null;
  result: string | null;
}

// Refresh Token을 사용하여 Access Token을 재발급받는 함수입니다.
// 재발급에 실패하면 에러를 발생시킵니다.
export const refreshToken = async (): Promise<void> => {
  // POST 요청 시 body는 비워둡니다.
  await axiosInstance.post<RefreshResponse>('/auth/refresh');
};
