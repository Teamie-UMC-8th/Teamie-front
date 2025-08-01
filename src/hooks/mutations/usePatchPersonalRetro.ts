import { useMutation } from '@tanstack/react-query';
import { patchPersonalRetro } from '@/services/personalRecalls/modify';

export const usePatchPersonalRetro = () => {
  return useMutation({
    mutationFn: patchPersonalRetro,
  });
};
