import { useMutation } from '@tanstack/react-query';
import { patchPersonalRetro } from '@/services/personalRecall/modify';

export const usePatchPersonalRetro = () => {
  return useMutation({
    mutationFn: patchPersonalRetro,
  });
};
