import axiosInstance from '@/lib/axiosInstance';
import { TaskSearchParams, TaskSearchResponse } from '@/types/api/tasks';
import axios from 'axios';

// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const searchTasks = async (params: TaskSearchParams): Promise<TaskSearchResponse> => {
  const { projectId, view, statuses, managerIds, dateBefore, dateAfter } = params;

  // 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  queryParams.append('view', view);

  if (statuses && statuses.length > 0) {
    statuses.forEach((status) => queryParams.append('statuses', status));
  }

  if (managerIds && managerIds.length > 0) {
    managerIds.forEach((id) => queryParams.append('managerIds', id.toString()));
  }

  if (dateBefore) {
    const formattedDate = formatDateToYYYYMMDD(dateBefore);
    queryParams.append('dateBefore', formattedDate);
  }

  if (dateAfter) {
    const formattedDate = formatDateToYYYYMMDD(dateAfter);
    queryParams.append('dateAfter', formattedDate);
  }

  try {
    console.log('검색 요청 파라미터:', {
      projectId,
      view,
      statuses,
      managerIds,
      dateBefore: dateBefore ? formatDateToYYYYMMDD(dateBefore) : undefined,
      dateAfter: dateAfter ? formatDateToYYYYMMDD(dateAfter) : undefined,
    });

    const response = await axiosInstance.get(
      `/api/v1/tasks/${projectId}/search?${queryParams.toString()}`
    );

    console.log('검색 API 응답:', response.data);

    // API 응답이 { isSuccess, error, result } 형태로 감싸져 있는지 확인
    if (response.data && response.data.isSuccess && response.data.result) {
      return response.data.result;
    } else if (response.data && response.data.result) {
      // result가 직접 있는 경우
      return response.data.result;
    } else {
      // 응답 자체가 TaskSearchResponse인 경우
      return response.data;
    }
  } catch (error) {
    console.error('검색 API 호출 중 오류:', error);
    if (axios.isAxiosError(error)) {
      console.error('응답 데이터:', error.response?.data);
      console.error('상태 코드:', error.response?.status);
    }
    throw error;
  }
};
