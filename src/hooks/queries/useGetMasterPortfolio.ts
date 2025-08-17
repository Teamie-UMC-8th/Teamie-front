import {
  fetchMasterPortfolioDetail,
  fetchMasterPortfolioDetailRecords,
  fetchMasterPortfolioList,
  getMasterPortfolioGeneratedResult,
  getMasterPortfolioStatus,
  fetchMasterPortfolioQuestions,
} from '@/services/masterPortfolio/masterportfolio';
import { fetchCorrectionProjects } from '@/services/correction/correction';
import { useQuery } from '@tanstack/react-query';
import type { MasterPortfolioDetailResponse } from '@/types/api/masterportfolio';

// 마스터 포트폴리오 목록을 가져오는 훅(마이페이지)
export const useMasterPortfolioList = (cursor?: string) => {
  return useQuery({
    queryKey: ['master-portfolios', cursor],
    queryFn: () => fetchMasterPortfolioList(cursor),
    staleTime: 1000 * 60 * 5,
  });
};

// 마스터 포트폴리오 상세 정보를 가져오는 훅(마스터포트폴리오)
export const useMasterPortfolioDetail = (projectId: number) => {
  return useQuery<MasterPortfolioDetailResponse['result']>({
    queryKey: ['master-portfolio', projectId],
    queryFn: () => fetchMasterPortfolioDetail(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId,
  });
};

export const useGetMasterPortfolioGeneratedResult = (portfolioId: number) => {
  return useQuery({
    queryKey: ['masterPortfolioGeneratedResult', portfolioId],
    queryFn: () => getMasterPortfolioGeneratedResult(portfolioId),
    staleTime: 1000 * 60 * 5,
    enabled: !!portfolioId, // portfolioId가 존재할 때만 요청
  });
};

export const useMasterPortfolioDetailRecords = (projectId: number) => {
  return useQuery({
    queryKey: ['master-portfolio-detail-records', projectId],
    queryFn: () => fetchMasterPortfolioDetailRecords(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId,
  });
};

export const useMasterPortfolioStatus = (projectId: number) => {
  return useQuery({
    queryKey: ['master-portfolio-status', projectId],
    queryFn: () => getMasterPortfolioStatus(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId,
  });
};

export const useMasterPortfolioQuestions = (portfolioId: number) => {
  return useQuery({
    queryKey: ['master-portfolio-questions', portfolioId],
    queryFn: () => fetchMasterPortfolioQuestions(portfolioId),
  });
};

// 추가: 프로젝트 선택 화면 전용 - 선택 가능한 프로젝트 목록 조회 훅
export const useCorrectionProjects = () => {
  return useQuery({
    queryKey: ['correction-projects'],
    queryFn: () => fetchCorrectionProjects(),
    staleTime: 1000 * 60 * 5,
  });
};
