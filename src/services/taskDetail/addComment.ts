import axiosInstance from '@/lib/axiosInstance';
import {
  AddCommentRequest,
  AddCommentResponse,
  GetCommentsRequest,
  GetCommentsResponse,
  AddCocommentRequest,
  AddCocommentResponse,
  UpdateCocommentRequest,
  UpdateCocommentResponse,
} from '@/types/api/comment';
import {
  getMockAddCommentResponse,
  getMockGetCommentsResponse,
  getMockAddCocommentResponse,
  getMockUpdateCocommentResponse,
} from '@/constants/commentMockData';

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

// 대댓글 생성 함수
export const addCocomment = async (
  commentId: number,
  data: AddCocommentRequest
): Promise<AddCocommentResponse> => {
  try {
    const response = await axiosInstance.post(`/api/v1/comments/${commentId}/cocomments`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('대댓글 추가 실패:', error);

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
      return getMockAddCocommentResponse(commentId, data.content);
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
        throw new Error('댓글을 찾을 수 없습니다.');
      }

      if (error.response.status === 400) {
        throw new Error('대댓글 내용을 입력해주세요.');
      }
    }

    throw new Error('대댓글 추가 중 오류가 발생했습니다.');
  }
};

// 대댓글 수정 함수
export const updateCocomment = async (
  cocommentId: number,
  data: UpdateCocommentRequest
): Promise<UpdateCocommentResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/v1/cocomments/${cocommentId}`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('대댓글 수정 실패:', error);

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
      return getMockUpdateCocommentResponse(cocommentId, data.content);
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
        throw new Error('대댓글을 찾을 수 없습니다.');
      }

      if (error.response.status === 400) {
        throw new Error('대댓글 내용을 입력해주세요.');
      }
    }

    throw new Error('대댓글 수정 중 오류가 발생했습니다.');
  }
};

// 댓글 조회 함수
export const getComments = async (
  taskId: number,
  offset: number = 0
): Promise<GetCommentsResponse> => {
  try {
    const response = await axiosInstance.get(`/api/v1/tasks/${taskId}/comments?offset=${offset}`);
    return response.data;
  } catch (error: unknown) {
    console.error('댓글 조회 실패:', error);

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
      return getMockGetCommentsResponse(taskId, offset);
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
    }

    throw new Error('댓글 조회 중 오류가 발생했습니다.');
  }
};
