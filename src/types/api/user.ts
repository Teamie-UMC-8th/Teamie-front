// 사용자 프로필 정보를 가져오는 훅
export interface UserProfile {
  imageUrl: string;
  name: string;
  school: string | null;
  major: string | null;
  email: string;
  projectNum: number;
}

// API 응답 구조 타입 정의
// result 필드에 UserProfile 타입이 포함된 응답 구조
export interface UserResponse {
  isSuccess: boolean;
  error: null;
  result: UserProfile;
}
