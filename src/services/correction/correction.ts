import {
  CorrectionListResponse,
  CorrectionDetailResponse,
  CreateCorrectionRequest,
  CreateCorrectionResponse,
  StartRagResponse,
  RagDataResponse,
  CompanyInsightResponse,
  PatchCompanyInsightRequest,
  PatchCompanyInsightResponse,
} from '@/types/api/correction';
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

export async function fetchCorrectionDetail(
  correctionId: number
): Promise<CorrectionDetailResponse['result']> {
  const { data } = await axiosInstance.get<CorrectionDetailResponse>(
    `/api/v1/portfolio-corrections/${correctionId}`
  );

  if (!data.result) {
    throw new Error('AI 첨삭 상세 정보를 가져올 수 없습니다.');
  }

  return data.result;
}

export async function createCorrection(
  correctionData: CreateCorrectionRequest
): Promise<CreateCorrectionResponse['result']> {
  // 디버그: 전송 직전 페이로드 로그
  console.log('[API] POST /api/v1/portfolio-corrections payload:', correctionData);
  const { data } = await axiosInstance.post<CreateCorrectionResponse>(
    '/api/v1/portfolio-corrections',
    correctionData
  );
  // 디버그: 응답 로그
  console.log('[API] POST /api/v1/portfolio-corrections response:', data);

  if (!data.result) {
    throw new Error('AI 첨삭 생성에 실패했습니다.');
  }

  return data.result;
}

export async function startRag(correctionId: number): Promise<StartRagResponse['result']> {
  // 디버그: RAG 시작 요청 로그
  console.log('[API] POST /api/v1/portfolio-corrections/{id}/rag id:', correctionId);
  const { data } = await axiosInstance.post<StartRagResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/rag`,
    {}
  );
  console.log('[API] RAG 시작 응답:', data);

  if (!data.result) {
    throw new Error('RAG 시작에 실패했습니다.');
  }

  return data.result;
}

export async function fetchRagData(correctionId: number): Promise<RagDataResponse['result']> {
  const { data } = await axiosInstance.get<RagDataResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/rag`
  );

  if (!data.result) {
    throw new Error('RAG 데이터 조회에 실패했습니다.');
  }

  return data.result;
}

export async function fetchCompanyInsight(
  correctionId: number
): Promise<CompanyInsightResponse['result']> {
  const { data } = await axiosInstance.get<CompanyInsightResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/company-insight`
  );

  if (!data.result) {
    throw new Error('기업 분석 정보 조회에 실패했습니다.');
  }

  return data.result;
}

export async function patchCompanyInsight(
  correctionId: number,
  body: PatchCompanyInsightRequest
): Promise<PatchCompanyInsightResponse['result']> {
  const { data } = await axiosInstance.patch<PatchCompanyInsightResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/company-insight`,
    body
  );

  if (!data.result) {
    throw new Error('기업 분석 정보 업데이트에 실패했습니다.');
  }

  return data.result;
}
