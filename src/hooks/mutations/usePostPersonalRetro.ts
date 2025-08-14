import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPersonalRetro } from '@/services/personalRecall/create';

export const usePostPersonalRetro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId }: { projectId: number }) => createPersonalRetro(projectId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-retro', variables.projectId] });
    },
  });
};
