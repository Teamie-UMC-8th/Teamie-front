export interface CalendarPlan {
  date: string;
  list: CalendarPlanItem[] | null;
}

export interface CalendarPlanItem {
  planId: number;
  title: string;
  startTime: string;
  endTime: string;
}

export interface CalendarPlanResponse {
  isSuccess: boolean;
  error: null;
  result: CalendarPlan[];
}