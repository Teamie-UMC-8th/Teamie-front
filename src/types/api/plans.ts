import { ApiErrorResponse } from './error';

export interface PlanUser {
  userId: number;
  name: string;
  imageUrl: string;
}

export interface PlanDetail {
  name: string;
  date: string;
  startHour: string;
  location: string;
  attendees: PlanUser[];
  memo: string;
  writers: PlanUser[];
  meetingRecords: string;
}

export interface PlanDetailResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: PlanDetail | null;
}

export interface DeletePlanResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: {
    message: string;
    planId: number;
  } | null;
}

export interface PatchPlanRequest {
  name?: string;
  date?: string;
  startHour?: string;
  location?: string;
  memo?: string;
  meetingRecords?: string;
}

export interface PatchPlanUsersRequest {
  attendees: number[];
  writers: number[];
}

export interface PatchPlanUsersResponse {
  isSuccess: boolean;
  error: ApiErrorResponse | null;
  result: PlanDetail | null;
}
