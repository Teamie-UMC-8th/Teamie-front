import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { LogoutResponse } from '@/types/api/logout';

export const useLogout = () => {
  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      const response = await axiosInstance.post<LogoutResponse>('/auth/logout');
      return response.data;
    },
  });
};
