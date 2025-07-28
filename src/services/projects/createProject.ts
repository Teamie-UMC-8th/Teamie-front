import axiosInstance from '@/lib/axiosInstance';
import { CreateProjectRequest, CreateProjectReponse } from '@/types/api/project';

export const postCreateProject = async (
  body: CreateProjectRequest
): Promise<CreateProjectReponse> => {
  const { data } = await axiosInstance.post<CreateProjectReponse>('/api/v1/projects', body);
  return data;
};
