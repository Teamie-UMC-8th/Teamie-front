import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchCompleteProject } from '@/services/projects/useProject';
import type { CompleteProjectResponse } from '@/types/api/project';

export const useCompleteProject = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation<CompleteProjectResponse, unknown, void>({
    mutationFn: () => patchCompleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectHome', projectId] });
      queryClient.invalidateQueries({ queryKey: ['userProjectPermission', String(projectId)] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', projectId] });
    },
  });
};
