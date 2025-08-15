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
  CorrectionProjectsResponse,
  PostGenerateCorrectionRequest,
  PostGenerateCorrectionResponse,
  GetGeneratedCorrectionResponse,
  GetGeneratedCorrectionByProjectResponse,
} from '@/types/api/correction';
import axiosInstance from '@/lib/axiosInstance';

export async function fetchCorrectionList(
  cursor?: string
): Promise<CorrectionListResponse['result']> {
  const params = cursor ? { cursor } : {};
  const { data } = await axiosInstance.get<CorrectionListResponse>(
    '/api/v1/users/me/portfolio-corrections',
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

// 프로젝트별 생성 결과 상세 조회
export async function fetchGeneratedCorrectionByProject(
  correctionId: number,
  projectId: number
): Promise<GetGeneratedCorrectionByProjectResponse['result']> {
  console.log('[API] GET /api/v1/portfolio-corrections/{id}/{projectId}', {
    correctionId,
    projectId,
  });
  const { data } = await axiosInstance.get<GetGeneratedCorrectionByProjectResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/${projectId}`
  );
  console.log('[API] GET /api/v1/portfolio-corrections/{id}/{projectId} response:', data);
  if (!data.result) {
    throw new Error('프로젝트별 생성 결과를 가져올 수 없습니다.');
  }
  return data.result;
}

// 생성 결과 조회 (projects + firstCorrection)
export async function fetchGeneratedCorrection(
  correctionId: number
): Promise<GetGeneratedCorrectionResponse['result']> {
  console.log('[API][GET][RESULTS] request -> /api/v1/portfolio-corrections/{id}/results', {
    correctionId,
  });
  const { data } = await axiosInstance.get<GetGeneratedCorrectionResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/results`
  );
  console.log('[API][GET][RESULTS] response <- /api/v1/portfolio-corrections/{id}/results', {
    hasProjects: Array.isArray(data?.result?.projects),
    projectCount: Array.isArray(data?.result?.projects) ? data.result.projects.length : 0,
    hasFirst: !!data?.result?.firstCorrection,
  });
  if (!data.result) {
    throw new Error('생성된 첨삭 결과를 가져올 수 없습니다.');
  }
  return data.result;
}

// 선택된 프로젝트들로 첨삭 생성
export async function postGenerateCorrection(
  correctionId: number,
  payload: PostGenerateCorrectionRequest
): Promise<PostGenerateCorrectionResponse['result']> {
  console.log('[API][POST][GENERATE] request -> /api/v1/portfolio-corrections/{id}/generate', {
    correctionId,
    selectedProjects: payload?.selectedProjects,
  });
  const { data } = await axiosInstance.post<PostGenerateCorrectionResponse>(
    `/api/v1/portfolio-corrections/${correctionId}/generate`,
    payload
  );
  console.log('[API][POST][GENERATE] response <- /api/v1/portfolio-corrections/{id}/generate', {
    isSuccess: data?.isSuccess,
    items: Array.isArray(data?.result) ? data.result.length : 0,
  });
  if (!data.result) {
    throw new Error('첨삭 생성에 실패했습니다.');
  }
  return data.result;
}

// 프로젝트 선택 화면: 선택 가능한 프로젝트 목록 조회
export async function fetchCorrectionProjects(): Promise<CorrectionProjectsResponse['result']> {
  console.log('[API] GET /api/v1/portfolio-corrections/projects');
  const { data } = await axiosInstance.get<CorrectionProjectsResponse>(
    '/api/v1/portfolio-corrections/projects'
  );
  console.log('[API] GET /api/v1/portfolio-corrections/projects response:', data);

  if (!data.result) {
    throw new Error('선택 가능한 프로젝트 목록을 가져올 수 없습니다.');
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

// 포트폴리오 첨삭 제목 수정
export async function patchCorrectionTitle(
  correctionId: number,
  payload: { title: string }
): Promise<void> {
  console.log('[API] PATCH /api/v1/portfolio-corrections/{id} request:', {
    correctionId,
    title: payload?.title,
  });
  await axiosInstance.patch(`/api/v1/portfolio-corrections/${correctionId}`, payload);
}

// 포트폴리오 첨삭 삭제
export async function deleteCorrection(correctionId: number): Promise<void> {
  console.log('[API] DELETE /api/v1/portfolio-corrections/{id} request:', { correctionId });
  await axiosInstance.delete(`/api/v1/portfolio-corrections/${correctionId}`);
}
