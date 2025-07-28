import { useMutation } from '@tanstack/react-query';
import { postCreateProject } from '@/services/projects/createProject';
import { CreateProjectReponse } from '@/types/api/project';

export const useCreateProject = (
  onSuccess?: (response: CreateProjectReponse) => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: postCreateProject,
    onSuccess,
    onError,
  });
};
