import {
  ProjectHomeResponse,
  PostItData,
  CreatePostItResponse,
  DeletePostItResponse,
  ChangeLeaderResponse,
} from '@/types/api/projectHome';

/**
 * 프로젝트 홈 API 응답을 위한 mock 데이터
 */
export const projectHomeMockData: ProjectHomeResponse = {
  isSuccess: true,
  error: null,
  result: {
    project: {
      id: 544844,
      name: 'Teamie',
      goal: '협업의 진행과 기록, AI 포트폴리오 정리까지 지원하는 대학생 맞춤형 협업툴 ',
      rule: '우리 팀의 규칙은 매주 스탠드업 미팅을 진행하고, 코드 리뷰를 필수로 하며, 서로의 의견을 존중하는 것입니다.',
      users: [
        {
          id: 1,
          name: '김수빈',
          email: 'kim@example.com',
          school: '중앙대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'LEADER',
          role: '기획',
          tasks: [],
        },
        {
          id: 2,
          name: '김수진',
          email: 'lee@example.com',
          school: '중앙대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: '디자이너',
          tasks: [],
        },
        {
          id: 3,
          name: '두현우',
          email: 'park@example.com',
          school: '명지대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: 'FE 개발자',
          tasks: [],
        },
        {
          id: 4,
          name: '김태화',
          email: 'choi@example.com',
          school: '가천대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: 'FE 개발자',
          tasks: [],
        },
        {
          id: 5,
          name: '이예린',
          email: 'jung@example.com',
          school: '가천대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: 'FE 개발자',
          tasks: [],
        },
        {
          id: 6,
          name: '강효인',
          email: 'han@example.com',
          school: '중앙대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: 'BE 개발자',
          tasks: [],
        },
        {
          id: 7,
          name: '김채연',
          email: 'yoon@example.com',
          school: '중앙대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: 'BE 개발자',
          tasks: [],
        },
        {
          id: 8,
          name: '강성경',
          email: 'kang@example.com',
          school: '중앙대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: 'BE 개발자',
          tasks: [],
        },
        {
          id: 9,
          name: '나준원',
          email: 'kang@example.com',
          school: '중앙대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'MEMBER',
          role: 'AI 개발자',
          tasks: [],
        },
      ],
    },
    users: [
      {
        id: 1,
        name: '김채연',
        email: 'kim@example.com',
        school: '명지대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'LEADER',
        role: '기획',
        tasks: [],
      },
      {
        id: 2,
        name: '김수진',
        email: 'lee@example.com',
        school: '중앙대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'MEMBER',
        role: '디자이너',
        tasks: [],
      },
      {
        id: 3,
        name: '두현우',
        email: 'park@example.com',
        school: '명지대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'MEMBER',
        role: 'FE 개발자',
        tasks: [],
      },
      {
        id: 4,
        name: '김태화',
        email: 'choi@example.com',
        school: '가천대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'MEMBER',
        role: 'FE 개발자',
        tasks: [],
      },
      {
        id: 5,
        name: '이예린',
        email: 'jung@example.com',
        school: '가천대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'MEMBER',
        role: 'FE 개발자',
        tasks: [],
      },
      {
        id: 6,
        name: '강효인',
        email: 'han@example.com',
        school: '중앙대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'MEMBER',
        role: 'BE 개발자',
        tasks: [],
      },
      {
        id: 7,
        name: '김채연',
        email: 'yoon@example.com',
        school: '중앙대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'MEMBER',
        role: 'BE 개발자',
        tasks: [],
      },
      {
        id: 8,
        name: '강성경',
        email: 'kang@example.com',
        school: '중앙대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'MEMBER',
        role: 'BE 개발자',
        tasks: [],
      },
    ],
  },
};

/**
 * PostIt mock 데이터
 */
export const postItMockData: PostItData[] = [
  {
    id: '1',
    content: '오늘 회의 시간\n오후 2시',
    createdAt: Date.now() - 1000 * 60 * 30, // 30분 전
  },
  {
    id: '2',
    content: '중요한 일정\n마감일: 금요일',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2시간 전
  },
  {
    id: '3',
    content: '코드 리뷰\n필수 사항',
    createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4시간 전
  },
  {
    id: '4',
    content: '디자인 가이드\n업데이트 완료',
    createdAt: Date.now() - 1000 * 60 * 60 * 6, // 6시간 전
  },
  {
    id: '5',
    content: '테스트 케이스\n작성 필요',
    createdAt: Date.now() - 1000 * 60 * 60 * 8, // 8시간 전
  },
  {
    id: '6',
    content: '배포 일정\n다음 주 월요일',
    createdAt: Date.now() - 1000 * 60 * 60 * 12, // 12시간 전
  },
  {
    id: '7',
    content: '사용자 피드백\n수집 중',
    createdAt: Date.now() - 1000 * 60 * 60 * 16, // 16시간 전
  },
  {
    id: '8',
    content: '성능 최적화\n진행 중',
    createdAt: Date.now() - 1000 * 60 * 60 * 20, // 20시간 전
  },
];

/**
 * 포스트잇 생성 성공 mock 데이터
 */
export const createPostItSuccessMockData: CreatePostItResponse = {
  isSuccess: true,
  error: null,
  result: {
    id: 1,
    userId: 1,
    content: '이것은 포스트잇 내용입니다.',
    projectId: 544844,
    createdAt: '2025-07-14T20:35:00.000Z',
  },
};

/**
 * 포스트잇 생성 실패 mock 데이터 (프로젝트 없음)
 */
export const createPostItNotFoundMockData: CreatePostItResponse = {
  isSuccess: false,
  error: {
    errorCode: 'PROJECT_NOT_FOUND',
    reason: '프로젝트를 찾을 수 없습니다.',
    data: null,
  },
  result: null,
};

/**
 * 포스트잇 생성 실패 mock 데이터 (개수 초과)
 */
export const createPostItExceededMockData: CreatePostItResponse = {
  isSuccess: false,
  error: {
    errorCode: 'POSTS_EXCEEDED',
    reason: '포스트잇은 14개까지 생성될 수 있습니다.',
    data: null,
  },
  result: null,
};

/**
 * 포스트잇 삭제 성공 mock 데이터
 */
export const deletePostItSuccessMockData: DeletePostItResponse = {
  isSuccess: true,
  error: null,
  result: {
    message: '포스트잇이 성공적으로 삭제되었습니다.',
  },
};

/**
 * 포스트잇 삭제 실패 mock 데이터 (권한 없음)
 */
export const deletePostItForbiddenMockData: DeletePostItResponse = {
  isSuccess: false,
  error: {
    errorCode: 'NOT_POST_AUTHOR',
    reason: '포스트잇 작성자만 삭제할 수 있습니다.',
    data: null,
  },
  result: null,
};

/**
 * 포스트잇 삭제 실패 mock 데이터 (프로젝트 없음)
 */
export const deletePostItNotFoundMockData: DeletePostItResponse = {
  isSuccess: false,
  error: {
    errorCode: 'PROJECT_NOT_FOUND',
    reason: '프로젝트를 찾을 수 없습니다.',
    data: null,
  },
  result: null,
};

/**
 * 포스트잇 삭제 실패 mock 데이터 (서버 에러)
 */
export const deletePostItServerErrorMockData: DeletePostItResponse = {
  isSuccess: false,
  error: {
    errorCode: 'REDIS_DATA_PARSE_ERROR',
    reason: 'Redis에서 데이터를 파싱하는 중 오류가 발생했습니다.',
    data: null,
  },
  result: null,
};

/**
 * 팀장 변경 성공 mock 데이터
 */
export const changeLeaderSuccessMockData: ChangeLeaderResponse = {
  isSuccess: true,
  error: null,
  result: {
    newLeaderId: 2,
    permission: 'LEAD',
  },
};

/**
 * 팀장 변경 실패 mock 데이터 (자기 자신 지정)
 */
export const changeLeaderSelfAssignMockData: ChangeLeaderResponse = {
  isSuccess: false,
  error: {
    errorCode: 'FORBIDDEN_SELF_ASSIGN',
    reason: '자기 자신을 팀장으로 지목할 수 없습니다.',
    data: null,
  },
  result: null,
};

/**
 * 팀장 변경 실패 mock 데이터 (프로젝트 없음)
 */
export const changeLeaderNotFoundMockData: ChangeLeaderResponse = {
  isSuccess: false,
  error: {
    errorCode: 'PROJECT_NOT_FOUND',
    reason: '프로젝트를 찾을 수 없습니다.',
    data: null,
  },
  result: null,
};

/**
 * 팀장 변경 실패 mock 데이터 (멤버가 아님)
 */
export const changeLeaderNotMemberMockData: ChangeLeaderResponse = {
  isSuccess: false,
  error: {
    errorCode: 'ASIGNEE_NOT_MEMBER',
    reason: '해당 사람은 프로젝트 멤버가 아닙니다.',
    data: null,
  },
  result: null,
};

/**
 * 에러 응답 mock 데이터
 */
export const projectHomeErrorMockData: ProjectHomeResponse = {
  isSuccess: false,
  error: {
    errorCode: 'PROJECT_NOT_FOUND',
    reason: '프로젝트를 찾을 수 없습니다.',
    data: null,
  },
  result: null,
};

/**
 * 권한 없음 에러 mock 데이터
 */
export const forbiddenErrorMockData: ProjectHomeResponse = {
  isSuccess: false,
  error: {
    errorCode: 'FORBIDDEN_USER_FOR_UPDATE',
    reason: '해당 프로젝트에 접근 권한이 없습니다.',
    data: null,
  },
  result: null,
};

/**
 * 빈 프로젝트 mock 데이터
 */
export const emptyProjectMockData: ProjectHomeResponse = {
  isSuccess: true,
  error: null,
  result: {
    project: {
      id: 544844,
      name: '새 프로젝트',
      goal: '',
      rule: '',
      users: [],
    },
    users: [],
  },
};

/**
 * 단일 사용자 프로젝트 mock 데이터
 */
export const singleUserProjectMockData: ProjectHomeResponse = {
  isSuccess: true,
  error: null,
  result: {
    project: {
      id: 544844,
      name: '개인 프로젝트',
      goal: '개인 학습을 위한 프로젝트입니다.',
      rule: '혼자서 진행하는 프로젝트입니다.',
      users: [
        {
          id: 1,
          name: '김티미',
          email: 'kim@example.com',
          school: '명지대학교',
          imageUrl: '/icons/myprofile.svg',
          permission: 'LEADER',
          role: '개발자',
          tasks: [],
        },
      ],
    },
    users: [
      {
        id: 1,
        name: '김티미',
        email: 'kim@example.com',
        school: '명지대학교',
        imageUrl: '/icons/myprofile.svg',
        permission: 'LEADER',
        role: '개발자',
        tasks: [],
      },
    ],
  },
};
