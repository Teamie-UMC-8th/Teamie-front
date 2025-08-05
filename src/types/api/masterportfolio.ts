export interface MasterPortfolio {
  portfolioId: number;
  projectName: string;
  category: string;
  contributionRate: number;
  startDate: string;
  endDate: string;
  mainTask: string;
}

export interface PageInfo {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface MasterPortfolioListResponse {
  isSuccess: boolean;
  error: null;
  result: {
    data: MasterPortfolio[];
    pageInfo: PageInfo;
  };
}

export enum PortfolioCategory {
  COURSE = 'COURSE', // 수업
  CLUB = 'CLUB', // 동아리
  ACTIVITY = 'ACTIVITY', // 대외활동
  PROJECT = 'PROJECT', // 프로젝트
  OTHER = 'OTHER', // 기타
}

export interface MasterPortfolioDetail {
  id: number;
  detailInfo: string;
  assignedTask: string;
  keyAchievement: string;
  insight: string;
  contributionRate: number;
  category: PortfolioCategory;
  projectId:number;
}

export interface MasterPortfolioDetailResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioDetail;
}

export interface PatchMasterPortfolioRequest {
  detailInfo: string;
  assignedTask: string;
  keyAchievement: string;
  insight: string;
  contributionRate: number;
  category: PortfolioCategory;
}

export interface MasterPortfolioQuestion {
  questionId: number;
  question: string;
  questionType: string;
  answer: string;
  reason: string;
}

export interface MasterPortfolioQuestionResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioQuestion[];
}
