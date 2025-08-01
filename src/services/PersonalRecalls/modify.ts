import axiosInstance from '@/lib/axiosInstance';
import { PersonalRetro } from '@/types/api/personalRecall';

export const patchPersonalRetro = async ({
  projectId,
  data,
}: {
  projectId: number;
  data: PersonalRetro;
}) => {
  const response = await axiosInstance.patch(
    `/api/v1/projects/${projectId}/personal-recalls`,
    data
  );
  return response.data;
};
