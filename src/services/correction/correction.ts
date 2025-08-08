import { CorrectionListResponse } from '@/types/api/correction';
import axiosInstance from '@/lib/axiosInstance';

export async function fetchCorrectionList(
  cursor?: string
): Promise<CorrectionListResponse['result']> {
  const params = cursor ? { cursor } : {};
  const { data } = await axiosInstance.get<CorrectionListResponse>(
    '/api/v1/portfolio-corrections/me',
    { params }
  );

  if (!data.result) {
    throw new Error('AI 첨삭 목록을 가져올 수 없습니다.');
  }

  return data.result;
}

export async function fetchCorrectionDetail(correctionId: number): Promise<any> {
  const { data } = await axiosInstance.get(`/api/v1/portfolio-corrections/${correctionId}`);

  if (!data.result) {
    throw new Error('AI 첨삭 상세 정보를 가져올 수 없습니다.');
  }

  return data.result;
}
