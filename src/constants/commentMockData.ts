import {
  AddCommentResponse,
  GetCommentsResponse,
  AddCocommentResponse,
  UpdateCocommentResponse,
  DeleteCocommentResponse,
} from '@/types/api/comment';

// 댓글 추가 모의 응답 데이터
export const getMockAddCommentResponse = (taskId: number, content: string): AddCommentResponse => ({
  isSuccess: true,
  error: null,
  result: {
    commentId: Math.floor(Math.random() * 1000) + 1, // 랜덤 ID 생성
    content: content,
  },
});

// 대댓글 생성 모의 응답 데이터
export const getMockAddCocommentResponse = (
  commentId: number,
  content: string
): AddCocommentResponse => ({
  isSuccess: true,
  error: null,
  result: {
    cocommentId: Math.floor(Math.random() * 1000) + 1, // 랜덤 ID 생성
    content: content,
  },
});

// 대댓글 수정 모의 응답 데이터
export const getMockUpdateCocommentResponse = (
  cocommentId: number,
  content: string
): UpdateCocommentResponse => ({
  isSuccess: true,
  error: null,
  result: {
    cocommentId: cocommentId,
    content: content,
  },
});

// 대댓글 삭제 모의 응답 데이터
export const getMockDeleteCocommentResponse = (cocommentId: number): DeleteCocommentResponse => ({
  isSuccess: true,
  error: null,
  result: '대댓글이 성공적으로 삭제되었습니다.',
});

// 댓글 조회 모의 응답 데이터
export const getMockGetCommentsResponse = (
  taskId: number,
  offset: number = 0
): GetCommentsResponse => ({
  isSuccess: true,
  error: null,
  result: {
    totalCount: 42,
    hasMore: true,
    comments: [
      {
        commentId: 1,
        content: '업무 기한을 다음주로 바꿔야할 것 같아요',
        createdAt: '2024-07-31T17:30:00Z',
        updatedAt: '2024-07-31T17:30:00Z',
        users: {
          imageUrl: 'https://s3.example.com/profile/example.png',
          name: '홍길동',
        },
        cocomments: [
          {
            cocommentId: 1,
            content: '네, 맞습니다. 기한을 조정해보겠습니다.',
            createdAt: '2024-07-31T18:00:00Z',
            updatedAt: '2024-07-31T18:00:00Z',
            users: {
              imageUrl: 'https://s3.example.com/profile/example2.png',
              name: '김철수',
            },
          },
        ],
      },
      {
        commentId: 2,
        content: '문서 검토가 완료되었습니다.',
        createdAt: '2024-07-31T16:45:00Z',
        updatedAt: '2024-07-31T16:45:00Z',
        users: {
          imageUrl: 'https://s3.example.com/profile/example3.png',
          name: '김수진',
        },
        cocomments: [],
      },
      {
        commentId: 3,
        content: 'API 연동 테스트가 필요합니다.',
        createdAt: '2024-07-31T15:20:00Z',
        updatedAt: '2024-07-31T15:20:00Z',
        users: {
          imageUrl: 'https://s3.example.com/profile/example4.png',
          name: '두현우',
        },
        cocomments: [],
      },
    ],
  },
});

// 댓글 목록 모의 데이터 (기존 호환성용)
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
