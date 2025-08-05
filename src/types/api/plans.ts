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
  error: null | { errorCode: string; reason: string };
  result: PlanDetail;
}

export interface PatchPlanRequest {
  name: string;
  date: string;
  location: string;
  startHour: string;
  memo: string;
  meetingRecords: string;
}

export default interface PatchPlanUsersRequest {
  attendees: number[];
  writers: number[];
}