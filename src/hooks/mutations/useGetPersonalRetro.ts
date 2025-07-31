import { useQuery } from '@tanstack/react-query';
import { fetchPersonalRetro } from '@/services/PersonalRecalls/check';

export const useGetPersonalRetro = (projectId: number) => {
  return useQuery({
    queryKey: ['personal-retro', projectId],
    queryFn: () => fetchPersonalRetro(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
};