import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCorrection } from '@/services/correction/correction';
import { CreateCorrectionRequest } from '@/types/api/correction';

export const useCreateCorrection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (correctionData: CreateCorrectionRequest) => {
      // 생성만 완료하고 바로 반환하여 UI 이동이 지연되지 않도록 한다
      const created = await createCorrection(correctionData);
      return created;
    },
    onSuccess: () => {
      // 첨삭 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['corrections'] });
    },
    onError: (error) => {
      console.error('첨삭 생성 또는 RAG 시작 실패:', error);
    },
  });
};
