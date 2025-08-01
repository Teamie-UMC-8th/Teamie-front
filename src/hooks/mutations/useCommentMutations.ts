import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addComment } from '@/services/taskDetail/addComment';
import { AddCommentResponse } from '@/types/api/comment';

// 댓글 추가 mutation
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: number; content: string }) =>
      addComment(taskId, { content }),
    onSuccess: (_data: AddCommentResponse, variables) => {
      // 댓글 추가 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskComments', variables.taskId] });
    },
    onError: (error: Error) => {
      console.error('댓글 추가 mutation 에러:', error);
    },
  });
};

// 댓글 수정 mutation
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => {
      // 실제 API가 준비되면 여기에 구현
      return Promise.resolve({ commentId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskComments'] });
    },
    onError: (error: Error) => {
      console.error('댓글 수정 mutation 에러:', error);
    },
  });
};

// 댓글 삭제 mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => {
      // 실제 API가 준비되면 여기에 구현
      return Promise.resolve({ commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskComments'] });
    },
    onError: (error: Error) => {
      console.error('댓글 삭제 mutation 에러:', error);
    },
  });
};
