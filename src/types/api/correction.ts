export interface Correction {
  correctionId: number;
  title: string;
  createdAt: string;
  jobTitle: string;
  submissionTarget: string;
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
// Backend returns links as { title, url }
export type RagLink = string | { title: string; url: string };

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

// 프로젝트 선택 화면: 선택 가능한 프로젝트 목록 응답 타입
export interface CorrectionSelectableProject {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  goal: string;
  rule: string;
  isCompleted: boolean;
  completedAt: string | null;
  hasMasterPortfolio: boolean; // 신규 필드: 마스터포트폴리오 생성 결과 존재 여부
}

export interface CorrectionProjectsResponse {
  isSuccess: boolean;
  error: null;
  result: CorrectionSelectableProject[];
}

// 첨삭 생성(선택 프로젝트들 기반) 요청/응답 타입
export interface PostGenerateCorrectionRequest {
  selectedProjects: number[]; // projectId 리스트
}

export interface CorrectionGenerateItem {
  projectId: number;
  projectName: string;
  correctionResult: GeneratedCorrectionResult;
}

export interface PostGenerateCorrectionResponse {
  isSuccess: boolean;
  error: null;
  result: CorrectionGenerateItem[];
}

// 생성 결과 조회 응답 타입 (projects + firstCorrection)
export interface GeneratedProjectsItem {
  id: number;
  name: string;
}

export interface GeneratedLineItem {
  line_number: string;
  original_content: string;
  type: number;
  review_comment: string;
}

export interface GeneratedFieldBlock {
  lines: GeneratedLineItem[];
  field_summary: string;
}

export interface GeneratedCorrectionResult {
  detailInfo: GeneratedFieldBlock;
  assignedTasks: GeneratedFieldBlock;
  keyAchievements: GeneratedFieldBlock;
  insights: GeneratedFieldBlock;
}

export interface FirstCorrectionBlock {
  projectId: number;
  projectName: string;
  correctionResult: GeneratedCorrectionResult;
}

export interface GetGeneratedCorrectionResponse {
  isSuccess: boolean;
  error: null;
  result: {
    projects: GeneratedProjectsItem[];
    firstCorrection: FirstCorrectionBlock;
  };
}

export interface GetGeneratedCorrectionByProjectResponse {
  isSuccess: boolean;
  error: null;
  result: FirstCorrectionBlock;
}

// AI 첨삭 상세 정보 응답 타입
export interface CorrectionDetailResponse {
  isSuccess: boolean;
  error: null;
  result: {
    correctionId: number;
    title: string;
    submissionTarget: string;
    createdAt: string;
    jobTitle: string;
    jd?: string;
    // API가 빈 껍데기이므로 기본적인 필드만 정의
    // 추후 실제 API 응답에 맞춰 확장 가능
    content?: string;
    status?: string;
    feedback?: string;
  };
}

// AI 첨삭 대상 마스터 포트폴리오 조회 응답 타입
export interface AiCorrectionMasterPortfolioItem {
  type: 'line' | 'header';
  number?: number;
  text: string;
}

export interface AiCorrectionMasterPortfolioResponse {
  isSuccess: boolean;
  error: null;
  result: {
    detailInfo: AiCorrectionMasterPortfolioItem[];
    assignedTask: AiCorrectionMasterPortfolioItem[];
    keyAchievement: AiCorrectionMasterPortfolioItem[];
    insight: AiCorrectionMasterPortfolioItem[];
  };
}
