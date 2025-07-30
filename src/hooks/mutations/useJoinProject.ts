import { useMutation } from '@tanstack/react-query';
import { getJoinProject } from '@/services/projects/joinProject';
import { JoinProjectResponse } from '@/types/api/project';

export const useJoinProject = (
  onSuccess?: (response: JoinProjectResponse) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: getJoinProject,
    onSuccess,
    onError,
  });
};
