import axiosInstance from '@/lib/axiosInstance';
import { MyTaskResponse } from '@/types/api/tasks';

export async function fetchMyTasks(cursor?: string): Promise<MyTaskResponse> {
  const res = await axiosInstance.get<MyTaskResponse>('/api/v1/users/me/tasks', {
    params: cursor ? { cursor } : undefined,
    withCredentials: true,
  });
  return res.data;
}
