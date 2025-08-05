// 일정 생성 요청
export interface PostPlanRequest {
  date: string; // ISO 8601 형식 문자열
}

// 일정 생성 응답
export interface PostPlanResponse {
  isSuccess: boolean;
  error: null | {
    errorCode: string;
    reason: string;
  };
  result: {
    planId: string;
    date: string;
  };
}

// 캘린더 조회 시 단일 일정 정보
export interface CalendarPlan {
  title: any;
  endDate: string | number | Date;
  startDate: string | number | Date;
  planId: string;
  name: string;
  date: string;
  startHour: string;
  endHour: string;
  location: string;
}

// 캘린더 조회 응답
export interface GetCalendarPlansResponse {
  isSuccess: boolean;
  error: null | {
    errorCode: string;
    reason: string;
  };
  result: {
    date: string;
    list: CalendarPlan[];
  }[];
}
