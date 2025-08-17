import { useMutation } from '@tanstack/react-query';
import { postPlan } from '@/services/teamCalendar/create';

export const usePostPlan = () =>
  useMutation({
    mutationFn: postPlan, // { projectId, date }
  });
