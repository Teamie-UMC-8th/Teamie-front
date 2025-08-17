import { postPlan } from '@/services/teamCalendar/create';
import { useMutation } from '@tanstack/react-query';

export const usePostPlan = () =>
  useMutation({
    mutationFn: postPlan, // { projectId, date }
  });
