import { useMutation } from '@tanstack/react-query';
import { patchPersonalRetro } from '@/services/PersonalRecalls/modify';

export const usePatchPersonalRetro = () => {
  return useMutation({
    mutationFn: patchPersonalRetro,
  });
};
