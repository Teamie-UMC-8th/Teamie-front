import axiosInstance from '@/lib/axiosInstance';
import { PersonalRetro, PersonalRetroResponse } from '@/types/api/personalRecall';

export const createPersonalRetro = async (
  projectId: number,
  body?: Partial<PersonalRetro>
): Promise<PersonalRetroResponse> => {
  const payload: PersonalRetro = {
    collaborationProfile: body?.collaborationProfile ?? '',
    memorableExperience: body?.memorableExperience ?? '',
    strengthsAndGrowth: body?.strengthsAndGrowth ?? '',
  };

  const { data } = await axiosInstance.post<PersonalRetroResponse>(
    `/api/v1/projects/${projectId}/personal-recalls`,
    payload
  );
  return data;
};
