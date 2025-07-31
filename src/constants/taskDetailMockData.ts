import { TaskDetailResponse } from '@/types/api/taskDetail';

// 모의 데이터
const getMockTaskData = (taskId: number): TaskDetailResponse => ({
  isSuccess: true,
  error: null,
  result: {
    name: '모의 업무',
    deadline: '2025-01-01 00:00:00',
    status: 'ONGOING' as const,
    memo: 'Teamie 화이팅!',
    managers: [
      { userId: 1, userName: '김티미' },
      { userId: 2, userName: '두현우' },
    ],
    files: [],
    stepId: 1,
  },
});

// 사용자 목록 모의 데이터
const getMockUserList = () => [
  { userId: 1, userName: '김수빈' },
  { userId: 2, userName: '김수진' },
  { userId: 3, userName: '두현우' },
  { userId: 4, userName: '강효인' },
];

export { getMockUserList };
export default getMockTaskData;
