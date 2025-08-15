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

// 대댓글 생성 API 요청 타입 정의
export interface AddCocommentRequest {
  content: string;
}

// 대댓글 생성 API 응답 타입 정의
export interface AddCocommentResponse {
  isSuccess: boolean;
  error: null;
  result: {
    cocommentId: number;
    content: string;
  };
}

// 대댓글 수정 API 요청 타입 정의
export interface UpdateCocommentRequest {
  content: string;
}

// 대댓글 수정 API 응답 타입 정의
export interface UpdateCocommentResponse {
  isSuccess: boolean;
  error: null;
  result: {
    cocommentId: number;
    content: string;
  };
}

// 댓글 수정 API 요청/응답 타입 정의
export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentResponse {
  isSuccess: boolean;
  error: null;
  result: {
    content: string;
  };
}

// 댓글 조회 API 요청 타입 정의
export interface GetCommentsRequest {
  taskId: number;
  offset: number;
}

// 댓글 조회 API 응답 타입 정의
export interface GetCommentsResponse {
  isSuccess: boolean;
  error: null;
  result: {
    totalCount: number;
    hasMore: boolean;
    comments: Comment[];
  };
}

// 댓글 타입 정의
export interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  users: {
    imageUrl: string;
    name: string;
  };
  cocomments: Cocomment[];
}

// 대댓글 타입 정의
export interface Cocomment {
  cocommentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  users: {
    imageUrl: string;
    name: string;
  };
}

// 대댓글 삭제 API 응답 타입 정의
export interface DeleteCocommentResponse {
  isSuccess: boolean;
  error: null;
  result: string;
}

// 댓글 삭제 API 응답 타입 정의
export interface DeleteCommentResponse {
  isSuccess: boolean;
  error: null;
  result: string;
}
