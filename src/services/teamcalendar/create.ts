import axiosInstance from '@/lib/axiosInstance';
import { PostPlanResponse } from '@/types/api/teamcalendar';

export const postPlan = async ({
  projectId,
  date,
}: {
  projectId: string;
  date: string;
}): Promise<PostPlanResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/projects/${projectId}/plans`, { date });
  return data;
};
