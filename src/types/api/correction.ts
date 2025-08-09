export interface Correction {
  correctionId: number;
  title: string;
  createdAt: string;
  jobTitle: string;
}

export interface CorrectionListResponse {
  isSuccess: boolean;
  error: null;
  result: {
    data: Correction[];
    pageInfo: {
      nextCursor: string | null;
      hasNextPage: boolean;
    };
  };
}

// AI 첨삭 상세 정보 응답 타입
export interface CorrectionDetailResponse {
  isSuccess: boolean;
  error: null;
  result: {
    correctionId: number;
    title: string;
    createdAt: string;
    jobTitle: string;
    // API가 빈 껍데기이므로 기본적인 필드만 정의
    // 추후 실제 API 응답에 맞춰 확장 가능
    content?: string;
    status?: string;
    feedback?: string;
  };
}
