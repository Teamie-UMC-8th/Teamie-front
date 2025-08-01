import { AddCommentResponse } from '@/types/api/comment';

// 댓글 추가 모의 응답 데이터
export const getMockAddCommentResponse = (taskId: number, content: string): AddCommentResponse => ({
  isSuccess: true,
  error: null,
  result: {
    commentId: Math.floor(Math.random() * 1000) + 1, // 랜덤 ID 생성
    content: content,
  },
});

// 댓글 목록 모의 데이터
export const getMockCommentList = () => [
  {
    commentId: 1,
    content: '업무 기한을 다음주로 바꿔야할 것 같아요',
    createdAt: '2024-07-31T17:30:00Z',
    userName: '김수빈',
  },
  {
    commentId: 2,
    content: '문서 검토가 완료되었습니다.',
    createdAt: '2024-07-31T16:45:00Z',
    userName: '김수진',
  },
  {
    commentId: 3,
    content: 'API 연동 테스트가 필요합니다.',
    createdAt: '2024-07-31T15:20:00Z',
    userName: '두현우',
  },
];
