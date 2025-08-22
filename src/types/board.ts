import { Step as OriginalStep } from '@/types/api/steps';
import { StatusGroup } from '@/types/api/dashboard';

// StepHeader가 totalTaskCount를 받을 수 있도록 Step 타입을 확장합니다.
export type Step = OriginalStep & { totalTaskCount: number };

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
