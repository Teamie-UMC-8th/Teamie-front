import { Step } from '@/types/api/steps';
import { StatusGroup } from '@/types/api/dashboard';

export interface StepsBoardProps {
  steps: Step[];
  projectId: string;
  isCompleted: boolean;
  onRefetchFilteredData?: () => void;
}

export interface StatusBoardProps {
  statusGroups: StatusGroup[];
  projectId: string;
  isCompleted: boolean;
}
