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

// AI 첨삭 생성 요청 타입
export interface CreateCorrectionRequest {
  title: string;
  submissionTarget: string;
  jobTitle: string;
  jd: string;
}

// AI 첨삭 생성 응답 타입
export interface CreateCorrectionResponse {
  isSuccess: boolean;
  error: null;
  result: {
    id: number;
    title: string;
    submissionTarget: string;
    jobTitle: string;
    companyInsight: string | null;
    jd: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
    };
  };
}

// RAG 시작 응답 타입
export interface StartRagResponse {
  isSuccess: boolean;
  error: null;
  result: {
    id: number;
    title: string;
    submissionTarget: string;
    jobTitle: string;
    companyInsight: string | null;
    jd: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

// RAG 데이터 조회 응답 타입
export type RagLink = string | { name: string; url: string };

export interface RagDataResponse {
  isSuccess: boolean;
  error: null;
  result: {
    keywords: string[];
    links: RagLink[];
  };
}

//기업 분석 정보 조회 응답 타입
export interface CompanyInsightResponse {
  isSuccess: boolean;
  error: null;
  result: {
    companyInsight: string;
  };
}

export interface PatchCompanyInsightRequest {
  companyInsight: string;
}

// 회사 인사이트 수정 응답(생성 응답과 동일한 객체 형태 반환)
export type PatchCompanyInsightResponse = CreateCorrectionResponse;

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
