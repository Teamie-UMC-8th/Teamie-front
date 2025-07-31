import { UserProfile } from '@/types/api/user';
import fetchUserProfile from '@/services/user/user';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  return useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};
