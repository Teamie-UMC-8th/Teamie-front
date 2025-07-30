import axiosInstance from '@/lib/axiosInstance';
import { JoinProjectResponse } from '@/types/api/project';

export const getJoinProject = async (inviteCode: string): Promise<JoinProjectResponse> => {
  const { data } = await axiosInstance.get<JoinProjectResponse>(
    `/api/v1/projects/join?inviteCode=${inviteCode}`
  );
  return data;
};
