// 마스터 포트폴리오 관련 타입 정의(마이페이지)
export interface MasterPortfolio {
  projectId:
    | string
    | number
    | bigint
    | boolean
    | readonly (string | number | bigint | boolean)[]
    | null
    | undefined;
  portfolioId: number;
  projectName: string;
  category: string;
  contributionRate: number;
  startDate: string;
  endDate: string;
  mainTask: string;
}

// API 응답 구조 타입 정의(마이페이지)
export interface PageInfo {
  nextCursor: string | null;
  hasNextPage: boolean;
}

// 마스터 포트폴리오 목록 응답 구조 타입 정의(마이페이지)
export interface MasterPortfolioListResponse {
  isSuccess: boolean;
  error: null;
  result: {
    data: MasterPortfolio[];
    pageInfo: PageInfo;
  };
}
//api 1번

export interface PostMasterPortfolioQuestionRequest {
  recordIdList: number[];
}

export interface MasterPortfolioQuestion {
  id?: number; // deprecated, use questionId
  questionId?: number;
  question: string;
  questionType: 'YES_NO' | 'TEXT';
  answer: 'YES' | 'NO' | null;
  reason: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostMasterPortfolioQuestionResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioQuestion[];
}

// 마스터 포트폴리오 상세 정보 타입 정의(마스터포트폴리오)
export interface MasterPortfolioDetail {
  id: number;
  detailInfo: string;
  assignedTask: string;
  keyAchievement: string;
  insight: string;
  contributionRate?: number; //
  mainTask?: string;
  category?: string;
  projectId?: number;
}

// 마스터 포트폴리오 상세 정보 응답 구조 타입 정의(마스터포트폴리오)
export interface MasterPortfolioDetailResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioDetail;
}
//api 5번

export interface MasterPortfolioGeneratedResult {
  detailInfo: string;
  assignedTask: string;
  keyAchievement: string;
  insight: string;
}

export interface MasterPortfolioGeneratedResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioGeneratedResult;
}

export interface MasterPortfolioDetailRecords {
  id: number;
  name: string;
  date: string;
  meetingRecords: string;
}

export interface MasterPortfolioDetailRecordsResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioDetailRecords[];
}

//마스터 포트폴리오 진행 상태 조회 api
export interface MasterPortfolioStatusResponse {
  isSuccess: boolean;
  error: null;
  result: {
    status: 'DONE' | 'NOT_STARTED' | 'NEED_ANSWERS' | 'GENERATING';
  };
}

export interface PatchMasterPortfolioRequest {
  detailInfo: string;
  assignedTask: string;
  keyAchievement: string;
  insight: string;
  contributionRate: number;
  mainTask: string;
  category: string;
}

// 마스터 포트폴리오 질문(답변) 업데이트 PATCH용 타입
export interface PatchMasterPortfolioQuestionItem {
  questionId: number;
  answer?: 'YES' | 'NO';
  reason?: string;
}

export type PatchMasterPortfolioQuestionsRequest = PatchMasterPortfolioQuestionItem[];

export interface PatchMasterPortfolioQuestionsResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioQuestion[];
}
