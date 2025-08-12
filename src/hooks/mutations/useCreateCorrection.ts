import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCorrection, startRag } from '@/services/correction/correction';
import { CreateCorrectionRequest } from '@/types/api/correction';

export const useCreateCorrection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (correctionData: CreateCorrectionRequest) => {
      const created = await createCorrection(correctionData);
      // 생성에 성공하면 RAG 시작
      await startRag(created.id);
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
