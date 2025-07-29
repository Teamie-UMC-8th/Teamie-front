import { AddCommentRequest, AddCommentResponse } from '@/types/api/comment';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const addComment = async ({ taskId, content }: AddCommentRequest): Promise<AddCommentResponse> => {
  const response = await axios.post(`/api/v1/tasks/${taskId}/comments`, { content });
  return response.data;
};

export const useAddComment = () => {
  return useMutation({
    mutationFn: addComment,
  });
};
