import axiosInstance from '@/lib/axiosInstance';
import {
  MasterPortfolioListResponse,
  MasterPortfolioDetailResponse,
  PostMasterPortfolioQuestionRequest,
  PostMasterPortfolioQuestionResponse,
  MasterPortfolioGeneratedResponse,
  MasterPortfolioDetailRecordsResponse,
  MasterPortfolioStatusResponse,
  PatchMasterPortfolioRequest,
} from '@/types/api/masterportfolio';
import { AxiosResponse } from 'axios';

// 마스터 포트폴리오 목록을 가져오는 함수
export const fetchMasterPortfolioList = async (cursor?: string) => {
  const res: AxiosResponse<MasterPortfolioListResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/me`,
    {
      params: cursor ? { cursor } : {},
    }
  );
  return res.data.result;
};

export const postMasterPortfolioQuestions = async (
  portfolioId: number,
  body: PostMasterPortfolioQuestionRequest
): Promise<PostMasterPortfolioQuestionResponse> => {
  const response = await axiosInstance.post(
    `/api/v1/master-portfolios/${portfolioId}/questions`,
    body
  );
  return response.data;
};

// 마스터 포트폴리오 상세 정보를 가져오는 함수(마스터포트폴리오)
export const fetchMasterPortfolioDetail = async (portfolioId: number) => {
  const res: AxiosResponse<MasterPortfolioDetailResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/${portfolioId}`
  );
  return res.data.result;
};

//생성 결과 조회
export const getMasterPortfolioGeneratedResult = async (
  portfolioId: number
): Promise<MasterPortfolioGeneratedResponse> => {
  const response = await axiosInstance.get(
    `/api/v1/master-portfolios/${portfolioId}/generation-result`
  );
  return response.data;
};

// 마스터 포트폴리오 상세 레코드를 가져오는 함수(마스터포트폴리오 상세 레코드)
export const fetchMasterPortfolioDetailRecords = async (projectId: number) => {
  const res: AxiosResponse<MasterPortfolioDetailRecordsResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/${projectId}/records`
  );

  return res.data.result;
};

export const getMasterPortfolioStatus = async (projectId: number) => {
  const res: AxiosResponse<MasterPortfolioStatusResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/${projectId}/status`
  );
  return res.data;
};

export const patchMasterPortfolio = async (
  portfolioId: number,
  body: PatchMasterPortfolioRequest
) => {
  const response = await axiosInstance.patch(`/api/v1/master-portfolios/${portfolioId}`, body);
  return response.data;
};

//마스터 포트폴리오 생성 api 추가
export const postMasterPortfolioGenerate = async (
  portfolioId: number
): Promise<MasterPortfolioGeneratedResponse> => {
  const response = await axiosInstance.post(`/api/v1/master-portfolios/${portfolioId}/generate`);
  return response.data;
};
