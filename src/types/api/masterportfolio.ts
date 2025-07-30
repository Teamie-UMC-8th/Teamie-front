// 마스터 포트폴리오 관련 타입 정의(마이페이지)
export interface MasterPortfolio {
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

// 마스터 포트폴리오 상세 정보 타입 정의(마스터포트폴리오)
export interface MasterPortfolioDetail {
  id: number;
  detailInfo: string;
  assignedTask: string;
  keyAchievement: string;
  insight: string;
  contributionRate: number;
  mainTask: string;
  category: string;
}

// 마스터 포트폴리오 상세 정보 응답 구조 타입 정의(마스터포트폴리오)
export interface MasterPortfolioDetailResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioDetail;
}
