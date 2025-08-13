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

  // submissionTarget 누락 항목 보강 (상세 호출 통해 병합)
  const list = data.result.data || [];
  const missing = list.filter((item) => !item.submissionTarget);
  if (missing.length > 0) {
    try {
      const details = await Promise.all(
        missing.map((m) => fetchCorrectionDetail(m.correctionId).catch(() => null))
      );
      const idToSubmissionTarget: Record<number, string> = {};
      details.forEach((det) => {
        if (det && det.correctionId && det.submissionTarget) {
          idToSubmissionTarget[det.correctionId] = det.submissionTarget;
        }
      });
      data.result.data = list.map((item) => ({
        ...item,
        submissionTarget: item.submissionTarget || idToSubmissionTarget[item.correctionId],
      }));
    } catch {
      // 보강 실패 시 원본 반환
    }
  }

  return data.result;
}

export async function fetchCorrectionDetail(
  correctionId: number
): Promise<CorrectionDetailResponse['result']> {
  console.log('[API] GET /api/v1/portfolio-corrections/{id} id:', correctionId);
  const { data } = await axiosInstance.get<CorrectionDetailResponse>(
    `/api/v1/portfolio-corrections/${correctionId}`
  );
  console.log('[API] GET /api/v1/portfolio-corrections/{id} response:', data);

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
  let data: StartRagResponse | undefined;
  try {
    // 일부 서버는 본문이 없는 POST를 요구합니다. 빈 객체({}) 대신 본문 없이 전송합니다.
    const resp = await axiosInstance.post<StartRagResponse>(
      `/api/v1/portfolio-corrections/${correctionId}/rag`
    );
    data = resp.data;
  } catch (err: unknown) {
    const error = err as { message?: string; response?: { status?: number; data?: unknown } };
    console.error('[API] RAG 시작 요청 실패:', {
      id: correctionId,
      message: error?.message,
      status: error?.response?.status,
      response: error?.response?.data,
    });
    throw err;
  }
  console.log('[API] RAG 시작 응답:', data);

  if (!data.result) {
    throw new Error('RAG 시작에 실패했습니다.');
  }

  return data.result;
}

export async function fetchRagData(correctionId: number): Promise<RagDataResponse['result']> {
  console.log('[API] GET /api/v1/portfolio-corrections/{id}/rag id:', correctionId);
  const { data } = await axiosInstance.get<RagDataResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/rag`
  );
  console.log('[API] GET /api/v1/portfolio-corrections/{id}/rag response:', data);

  if (!data.result) {
    throw new Error('RAG 데이터 조회에 실패했습니다.');
  }

  return data.result;
}

export async function fetchCompanyInsight(
  correctionId: number
): Promise<CompanyInsightResponse['result']> {
  console.log('[API] GET /api/v1/portfolio-corrections/{id}/company-insight id:', correctionId);
  const { data } = await axiosInstance.get<CompanyInsightResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/company-insight`
  );
  console.log('[API] GET /api/v1/portfolio-corrections/{id}/company-insight response:', data);

  if (!data.result) {
    throw new Error('기업 분석 정보 조회에 실패했습니다.');
  }

  return data.result;
}

export async function patchCompanyInsight(
  correctionId: number,
  body: PatchCompanyInsightRequest
): Promise<PatchCompanyInsightResponse['result']> {
  console.log('[API] PATCH /api/v1/portfolio-corrections/{id}/company-insight request:', {
    correctionId,
    length: (body?.companyInsight || '').length,
  });
  const { data } = await axiosInstance.patch<PatchCompanyInsightResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/company-insight`,
    body
  );
  console.log('[API] PATCH /api/v1/portfolio-corrections/{id}/company-insight response:', data);

  if (!data.result) {
    throw new Error('기업 분석 정보 업데이트에 실패했습니다.');
  }

  return data.result;
}
