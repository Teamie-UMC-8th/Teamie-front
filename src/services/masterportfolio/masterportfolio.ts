import axiosInstance from '@/lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

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

// 마스터 포트폴리오 상세 정보를 가져오는 함수(마스터포트폴리오)
export const fetchMasterPortfolioDetail = async (projectId: number) => {
  const res: AxiosResponse<MasterPortfolioDetailResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/${projectId}`
  );
  return res.data.result;
};
