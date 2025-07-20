export function deleteComment(
  idx: number, // 댓글 구분
  comments: string[], // 댓글 목록
  replyComments: { [key: number]: string } // 대댓글 목록
): [string[], { [key: number]: string }] {
  const newComments = comments.filter((_, i) => i !== idx);
  const newReplies = { ...replyComments };
  delete newReplies[idx];
  return [newComments, newReplies];
}
