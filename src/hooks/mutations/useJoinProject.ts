import { useMutation } from '@tanstack/react-query';
import { postJoinProject } from '@/services/projects/useProject';
import { PostJoinProjectResponse } from '@/types/api/project';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api/error';

export const useJoinProject = (
  onSuccess?: (response: PostJoinProjectResponse) => void,
  onError?: (error: AxiosError<ApiErrorResponse>) => void
) => {
  return useMutation({
    mutationFn: postJoinProject,
    onSuccess,
    onError,
  });
};
