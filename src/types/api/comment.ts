// 댓글 추가 API 요청 타입 정의
export interface AddCommentRequest {
  content: string;
}

// 댓글 추가 API 응답 타입 정의
export interface AddCommentResponse {
  isSuccess: boolean;
  error: null;
  result: {
    commentId: number;
    content: string;
  };
}
