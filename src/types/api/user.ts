export interface UserProject {
  id: string;
  name: string;
  role: string; // 사용자가 해당 프로젝트에서 맡은 역할
}

export interface UserProfile {
  imageUrl: string;
  name: string;
  school: string | null;
  major: string | null;
  email: string;
  projectNum: number;
  projects: UserProject[]; // 사용자가 속한 프로젝트 목록
}

// 사용자 프로필 API 응답 구조
export interface UserResponse {
  isSuccess: boolean;
  error: null;
  result: UserProfile;
}

// 사용자 프로젝트 API 응답 구조
export interface UserProjectsResponse {
  isSuccess: boolean;
  error: null;
  result: {
    projects: UserProject[];
  };
}
