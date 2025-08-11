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
  DeleteCocommentResponse,
  DeleteCommentResponse,
} from '@/types/api/comment';

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

// 대댓글 삭제 함수
export const deleteCocomment = async (cocommentId: number): Promise<DeleteCocommentResponse> => {
  console.log('🚀 대댓글 삭제 API 호출 시작:', { cocommentId });

  try {
    console.log('📡 DELETE 요청 전송:', `/api/v1/cocomments/${cocommentId}`);
    const response = await axiosInstance.delete(`/api/v1/cocomments/${cocommentId}`);
    console.log('✅ 대댓글 삭제 API 성공:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ 대댓글 삭제 실패:', {
      error,
      errorType: typeof error,
      hasResponse: error && typeof error === 'object' && 'response' in error,
    });

    // 실제 API 에러 응답 처리
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response
    ) {
      console.error('🔍 API 에러 상세 정보:', {
        status: error.response.status,
      });

      if (error.response.status === 404) {
        console.error('🔍 대댓글을 찾을 수 없음 (404)');
        throw new Error('대댓글을 찾을 수 없습니다.');
      }
    }

    console.error('💥 대댓글 삭제 중 예상치 못한 오류 발생');
    throw new Error('대댓글 삭제 중 오류가 발생했습니다.');
  }
};

// 댓글 삭제 함수
export const deleteComment = async (commentId: number): Promise<DeleteCommentResponse> => {
  console.log('🚀 댓글 삭제 API 호출 시작:', { commentId });

  try {
    console.log('📡 DELETE 요청 전송:', `/api/v1/comments/${commentId}`);
    const response = await axiosInstance.delete(`/api/v1/comments/${commentId}`);
    console.log('✅ 댓글 삭제 API 성공:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ 댓글 삭제 실패:', {
      error,
      errorType: typeof error,
      hasResponse: error && typeof error === 'object' && 'response' in error,
    });

    // 실제 API 에러 응답 처리
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response
    ) {
      console.error('🔍 API 에러 상세 정보:', {
        status: error.response.status,
      });

      if (error.response.status === 404) {
        console.error('🔍 댓글을 찾을 수 없음 (404)');
        throw new Error('댓글을 찾을 수 없습니다.');
      }
    }

    console.error('💥 댓글 삭제 중 예상치 못한 오류 발생');
    throw new Error('댓글 삭제 중 오류가 발생했습니다.');
  }
};

// 댓글 조회 함수
export const getComments = async (
  taskId: number,
  offset: number = 0
): Promise<GetCommentsResponse> => {
  try {
    console.log('📡 댓글 조회 API 호출:', { taskId, offset });
    const response = await axiosInstance.get(`/api/v1/tasks/${taskId}/comments?offset=${offset}`);
    console.log('✅ 댓글 조회 API 성공:', {
      status: response.status,
      data: response.data,
      commentsCount: response.data?.result?.comments?.length || 0,
    });
    return response.data;
  } catch (error: unknown) {
    console.error('댓글 조회 실패:', error);

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
