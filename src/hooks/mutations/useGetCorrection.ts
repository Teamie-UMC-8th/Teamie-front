import { useQuery } from '@tanstack/react-query';
import { fetchCorrectionList } from '@/services/correction/correction';

export const useCorrectionList = (cursor?: string) => {
  return useQuery({
    queryKey: ['corrections', cursor],
    queryFn: () => fetchCorrectionList(cursor),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};
