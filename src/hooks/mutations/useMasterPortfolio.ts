import {
  fetchMasterPortfolioDetail,
  fetchMasterPortfolioList,
} from '@/services/masterportfolio/masterportfolio';
import { useQuery } from '@tanstack/react-query';

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
  return useQuery({
    queryKey: ['master-portfolio', projectId],
    queryFn: () => fetchMasterPortfolioDetail(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId,
  });
};
