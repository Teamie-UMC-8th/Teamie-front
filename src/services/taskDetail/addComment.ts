import axiosInstance from '@/lib/axiosInstance';
import { AddCommentRequest, AddCommentResponse } from '@/types/api/comment';
import { getMockAddCommentResponse } from '@/constants/commentMockData';

// 댓글 추가 함수
export const addComment = async (
  taskId: number,
  data: AddCommentRequest
): Promise<AddCommentResponse> => {
  try {
    const response = await axiosInstance.post(`/api/v1/tasks/${taskId}/comments`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('댓글 추가 실패:', error);

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
      return getMockAddCommentResponse(taskId, data.content);
    }

    // 실제 API 에러 응답 처리
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response
    ) {
      if (error.response.status === 404) {
        throw new Error('업무를 찾을 수 없습니다.');
      }

      if (error.response.status === 400) {
        throw new Error('댓글 내용을 입력해주세요.');
      }
    }

    throw new Error('댓글 추가 중 오류가 발생했습니다.');
  }
};
