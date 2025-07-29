export interface AddCommentRequest {
  taskId: number;
  content: string;
}

export interface AddCommentResponse {
  isSuccess: boolean;
  error: null | string;
  result: {
    commentId: number;
    taskId: number;
    content: string;
  };
}
