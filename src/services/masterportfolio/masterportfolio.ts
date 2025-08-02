import axiosInstance from '@/lib/axiosInstance';
import {
  MasterPortfolioListResponse,
  MasterPortfolioDetailResponse,
  MasterPortfolioQuestionResponse,
} from '@/types/api/masterportfolio';
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

// 마스터 포트폴리오 질문 생성 API
export const postMasterPortfolioQuestions = async (
  projectId: number
): Promise<MasterPortfolioQuestionResponse['result']> => {
  const res: AxiosResponse<MasterPortfolioQuestionResponse> = await axiosInstance.post(
    `/api/v1/master-portfolios/${projectId}/questions`
    //`/api/v1/master-portfolios/247/questions`
  );
  return res.data.result;
};

// 마스터 포트폴리오 결과 조회 API
export const getMasterPortfolioDetail = async (
  projectId: number
): Promise<MasterPortfolioDetailResponse['result']> => {
  const res: AxiosResponse<MasterPortfolioDetailResponse> = await axiosInstance.get(
    `/api/v1/master-portfolios/${projectId}`
  );
  return res.data.result;
};

//마스터 포트폴리오 업데이트 API
export interface PatchMasterPortfolioRequest {
  detailInfo: string;
  assignedTask: string;
  keyAchievement: string;
  insight: string;
  contributionRate: number;
  category: 'PROJECT' | 'CLUB' | 'OUTSIDE' | 'CLASS' | 'OTHER'; // API에 맞게 enum 값
}

export const patchMasterPortfolio = async (
  projectId: number,
  data: PatchMasterPortfolioRequest
): Promise<MasterPortfolioDetailResponse['result']> => {
  const response: AxiosResponse<MasterPortfolioDetailResponse> = await axiosInstance.patch(
    `/api/v1/master-portfolios/${projectId}`,
    data
  );
  return response.data.result;
};
