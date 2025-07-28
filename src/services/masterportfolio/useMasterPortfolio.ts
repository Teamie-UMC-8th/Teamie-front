import axiosInstance from '@/lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

// 마스터 포트폴리오 관련 타입 정의(마이페이지)
interface MasterPortfolio {
  portfolioId: number;
  projectName: string;
  category: string;
  contributionRate: number;
  startDate: string;
  endDate: string;
  mainTask: string;
}

// API 응답 구조 타입 정의(마이페이지)
interface PageInfo {
  nextCursor: string | null;
  hasNextPage: boolean;
}

// 마스터 포트폴리오 목록 응답 구조 타입 정의(마이페이지)
interface MasterPortfolioListResponse {
  isSuccess: boolean;
  error: null;
  result: {
    data: MasterPortfolio[];
    pageInfo: PageInfo;
  };
}

// 마스터 포트폴리오 상세 정보 타입 정의(마스터포트폴리오)
interface MasterPortfolioDetail {
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
interface MasterPortfolioDetailResponse {
  isSuccess: boolean;
  error: null;
  result: MasterPortfolioDetail;
}

// 마스터 포트폴리오 목록을 가져오는 함수(마이페이지)
export const fetchMasterPortfolioList = async (cursor?: string) => {
  const res: AxiosResponse<MasterPortfolioListResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/me`,
    {
      params: cursor ? { cursor } : {},
    }
  );
  return res.data.result;
};

// 마스터 포트폴리오 목록을 가져오는 훅(공용)
export const useMasterPortfolioList = (cursor?: string) => {
  return useQuery({
    queryKey: ['master-portfolios', cursor],
    queryFn: () => fetchMasterPortfolioList(cursor),
    staleTime: 1000 * 60 * 5,
  });
};

// 마스터 포트폴리오 상세 정보를 가져오는 함수(마이페이지)
export const fetchMasterPortfolioDetail = async (projectId: number) => {
  const res: AxiosResponse<MasterPortfolioDetailResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/${projectId}`
  );
  return res.data.result;
};

// 마스터 포트폴리오 상세 정보를 가져오는 훅(마스터포트폴리오)
export const useMasterPortfolioDetail = (projectId: number) => {
  return useQuery({
    queryKey: ['master-portfolio', projectId],
    queryFn: () => fetchMasterPortfolioDetail(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId,
  });
};
