import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  addComment,
  getComments,
  addCocomment,
  updateCocomment,
  deleteCocomment,
  deleteComment,
} from '@/services/taskDetail/addComment';
import {
  AddCommentResponse,
  GetCommentsResponse,
  AddCocommentResponse,
  UpdateCocommentResponse,
  DeleteCocommentResponse,
  DeleteCommentResponse,
} from '@/types/api/comment';

// 댓글 조회 query
export const useGetComments = (taskId: number, offset: number = 0) => {
  return useQuery({
    queryKey: ['taskComments', taskId, offset],
    queryFn: () => getComments(taskId, offset),
    enabled: !!taskId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// 댓글 추가 mutation
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: number; content: string }) =>
      addComment(taskId, { content }),
    onSuccess: (_data: AddCommentResponse, variables) => {
      // 댓글 추가 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskComments', variables.taskId] });
      queryClient.removeQueries({ queryKey: ['taskComments', variables.taskId] });
    },
    onError: (error: Error) => {
      console.error('댓글 추가 mutation 에러:', error);
    },
  });
};

// 대댓글 추가 mutation
export const useAddCocomment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      addCocomment(commentId, { content }),
    onSuccess: (_data: AddCocommentResponse, variables) => {
      // 대댓글 추가 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskComments'] });
      queryClient.removeQueries({ queryKey: ['taskComments'] });
    },
    onError: (error: Error) => {
      console.error('대댓글 추가 mutation 에러:', error);
    },
  });
};

// 대댓글 수정 mutation
export const useUpdateCocomment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cocommentId, content }: { cocommentId: number; content: string }) =>
      updateCocomment(cocommentId, { content }),
    onSuccess: (_data: UpdateCocommentResponse, variables) => {
      // 대댓글 수정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['taskComments'] });
      queryClient.removeQueries({ queryKey: ['taskComments'] });
    },
    onError: (error: Error) => {
      console.error('대댓글 수정 mutation 에러:', error);
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
      console.log('🔄 useDeleteComment mutation 시작:', { commentId });
      return deleteComment(commentId);
    },
    onSuccess: (_data: DeleteCommentResponse, variables) => {
      console.log('🎉 댓글 삭제 mutation 성공:', { commentId: variables, data: _data });
      // 댓글 삭제 성공 시 관련 캐시 완전 제거
      queryClient.removeQueries({ queryKey: ['taskComments'] });
      queryClient.invalidateQueries({ queryKey: ['taskComments'] });
      console.log('🔄 댓글 목록 캐시 완전 제거 완료');
    },
    onError: (error: Error, variables) => {
      console.error('💥 댓글 삭제 mutation 에러:', { commentId: variables, error });
    },
  });
};

// 대댓글 삭제 mutation
export const useDeleteCocomment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cocommentId: number) => {
      console.log('🔄 useDeleteCocomment mutation 시작:', { cocommentId });
      return deleteCocomment(cocommentId);
    },
    onSuccess: (_data: DeleteCocommentResponse, variables) => {
      console.log('🎉 대댓글 삭제 mutation 성공:', { cocommentId: variables, data: _data });
      // 대댓글 삭제 성공 시 관련 캐시 완전 제거
      queryClient.removeQueries({ queryKey: ['taskComments'] });
      queryClient.invalidateQueries({ queryKey: ['taskComments'] });
      console.log('🔄 댓글 목록 캐시 완전 제거 완료');
    },
    onError: (error: Error, variables) => {
      console.error('💥 대댓글 삭제 mutation 에러:', { cocommentId: variables, error });
    },
  });
};
