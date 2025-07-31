import axiosInstance from '@/lib/axiosInstance';
import { PersonalRetroResponse, PersonalRetro } from '@/types/api/personalRecall';

export const fetchPersonalRetro = async (projectId: number): Promise<PersonalRetro> => {
  const { data } = await axiosInstance.get<PersonalRetroResponse>(
    `/api/v1/projects/${projectId}/personal-recalls`
  );
  return data.result;
};
