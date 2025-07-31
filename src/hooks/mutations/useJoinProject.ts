import { useMutation } from '@tanstack/react-query';
import { postJoinProject } from '@/services/projects/useProject';
import { PostJoinProjectResponse } from '@/types/api/project';

export const useJoinProject = (
  onSuccess?: (response: PostJoinProjectResponse) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: postJoinProject,
    onSuccess,
    onError,
  });
};
