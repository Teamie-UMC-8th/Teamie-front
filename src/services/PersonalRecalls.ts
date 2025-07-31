// service/PersonalRecalls.ts

import axiosInstance from '@/lib/axiosInstance';

export interface PersonalRetro {
  collaborationProfile: string;
  memorableExperience: string;
  strengthsAndGrowth: string;
}

export interface PersonalRetroResponse {
  isSuccess: boolean;
  error: null;
  result: PersonalRetro;
}

// GET: 회고 조회
export const getPersonalRetro = async (projectId: number): Promise<PersonalRetro> => {
  const { data } = await axiosInstance.get<PersonalRetroResponse>(
    `/api/v1/projects/${projectId}/personal-recalls`
  );
  return data.result; // 서비스에는 가져오는 함수만 있어야 함.
};

// PATCH: 회고 저장/수정
export const patchPersonalRetro = async ({
  projectId,
  data,
}: {
  projectId: number;
  data: PersonalRetro;
}) => {
  const res = await axiosInstance.patch(`/api/v1/projects/${projectId}/personal-recalls`, data);
  return res.data;
};
