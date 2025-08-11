import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPersonalRetro } from '@/services/personalRecall/modify';

export const usePatchPersonalRetro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPersonalRetro,
    onSuccess: (_, variables) => {
      // 개인 회고 데이터 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['personal-retro', variables.projectId],
      });
      console.log('개인 회고 데이터가 성공적으로 저장되었습니다:', variables.data);
    },
    onError: (error) => {
      console.error('개인 회고 저장 실패:', error);
      alert('개인 회고 저장 중 오류가 발생했습니다.');
    },
  });
};
