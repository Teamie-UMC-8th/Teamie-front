import { AddCommentRequest, AddCommentResponse } from '@/types/api/comment';

export async function addComment(
  taskId: number,
  comment: AddCommentRequest
): Promise<AddCommentResponse> {
  const response = await fetch(`/api/v1/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  });

  if (!response.ok) {
    throw new Error('댓글 추가에 실패했습니다.');
  }

  const data: AddCommentResponse = await response.json();
  return data;
}
