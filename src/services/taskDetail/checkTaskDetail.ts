import getMockTaskData from '@/constants/taskDetailMockData';
import axiosInstance from '@/lib/axiosInstance';
import {
  TaskDetailResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
} from '@/types/api/taskDetail';

// 업무 상세 조회 함수
export const checkTaskDetail = async (taskId: number): Promise<TaskDetailResponse> => {
  try {
    const response = await axiosInstance.get(`/api/v1/tasks/${taskId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('업무 상세 조회 실패:', error);

    // 개발 모드에서만 모의 데이터 사용
    if (
      process.env.NODE_ENV === 'development' &&
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 404
    ) {
      console.warn('API가 준비되지 않아 모의 데이터를 사용합니다.');
      return getMockTaskData();
    }

    // 실제 API 에러 응답 처리
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 404
    ) {
      const errorData = (error.response as any).data;
      if (errorData?.error?.reason) {
        throw new Error(errorData.error.reason);
      }
      throw new Error('업무를 찾을 수 없습니다.');
    }

    throw new Error('업무를 불러오는 중 오류가 발생했습니다.');
  }
};

// 업무 수정 함수
export const updateTaskDetail = async (
  taskId: number,
  data: UpdateTaskRequest
): Promise<UpdateTaskResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/v1/tasks/${taskId}`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('업무 수정 실패:', error);
    throw new Error('업무 수정 중 오류가 발생했습니다.');
  }
};

// 업무 삭제 함수
export const deleteTaskDetail = async (taskId: number): Promise<DeleteTaskResponse> => {
  try {
    const response = await axiosInstance.delete(`/api/v1/tasks/${taskId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('업무 삭제 실패:', error);

    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response
    ) {
      if (error.response.status === 404) {
        throw new Error('삭제할 업무를 찾을 수 없습니다.');
      }

      if (error.response.status === 403) {
        throw new Error('업무 삭제 권한이 없습니다.');
      }
    }

    throw new Error('업무 삭제 중 오류가 발생했습니다.');
  }
};
