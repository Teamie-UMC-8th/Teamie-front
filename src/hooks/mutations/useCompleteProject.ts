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
      // 프로젝트 종료 시 서버에서 마스터 포트폴리오가 자동 생성되므로 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['master-portfolios'] });
    },
  });
};
