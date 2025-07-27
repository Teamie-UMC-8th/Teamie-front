import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';


interface PersonalRetro {
  collaborationProfile: string;
  memorableExperience: string;
  strengthsAndGrowth: string;
}


interface PersonalRetroResponse {
  isSuccess: boolean;
  error: null;
  result: PersonalRetro;
}


const fetchPersonalRetro = async (projectId: number): Promise<PersonalRetro> => {
  const { data } = await axiosInstance.get<PersonalRetroResponse>(
    `/api/v1/projects/${projectId}/personal-recalls`
  );
  return data.result;
};

// useQuery 훅 (projectId를 매개변수로 받음!)
export const usePersonalRetro = (projectId: number) => {
  return useQuery({
    queryKey: ['personal-retro', projectId],
    queryFn: () => fetchPersonalRetro(projectId), 
    enabled: !!projectId, 
    staleTime: 1000 * 60 * 5,
  });
};
