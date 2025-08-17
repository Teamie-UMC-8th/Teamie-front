import { useQuery } from '@tanstack/react-query';
import { fetchPersonalRetro } from '@/services/personalRecall/check';
// 우리가 전에 만든 api 요청 함수를 리엑트쿼리에서 queryFn 으로 사용

// 프로젝트 아이디를 받아서 특정 개인 회고 데이터를 조회하는 쿼리 훅
//queryKey : 쿼리 데이터를 캐시에 저장할 때 사용하는 고유 키
//queryFn : 실제 데이터를 가져오는 함수
export const useGetPersonalRetro = (projectId: number) => {
  return useQuery({
    queryKey: ['personal-retro', projectId],
    queryFn: () => fetchPersonalRetro(projectId),
    enabled: !!projectId, // 프로젝트 아이디가 0 또는 undefined 면 요청 암함.
    staleTime: 1000 * 60 * 5, // 5분 동안은 네트워크 요청 안하고 캐시 데이터 재사용 
  });
};
