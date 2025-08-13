import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCorrection, startRag } from '@/services/correction/correction';
import { CreateCorrectionRequest } from '@/types/api/correction';

export const useCreateCorrection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (correctionData: CreateCorrectionRequest) => {
      // 생성만 완료하고 바로 반환하여 UI 이동이 지연되지 않도록 한다
      const created = await createCorrection(correctionData);
      return created;
    },
    onSuccess: (created) => {
      // RAG는 백그라운드로 시작 (대기하지 않음)
      try {
        // fire-and-forget
        void startRag(created.id);
      } catch (e) {
        // 실패해도 UI 흐름은 계속 진행
        console.error('RAG 시작 실패(비동기):', e);
      }
      // 첨삭 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['corrections'] });
    },
    onError: (error) => {
      console.error('첨삭 생성 또는 RAG 시작 실패:', error);
    },
  });
};
