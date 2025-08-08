import { Step } from '@/types/api/steps';
import { StatusGroup } from '@/types/api/dashboard';

export interface StepsBoardProps {
  steps: Step[];
  projectId: string;
}

export interface StatusBoardProps {
  statusGroups: StatusGroup[];
  projectId: string;
}
