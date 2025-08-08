import { TaskItemProps } from '@/types/api/tasks';

export interface Step {
  id: number;
  name: string;
  items: TaskItemProps[];
}

export interface Project {
  id: string;
  name: string;
  steps: Step[];
}

export const mockProjects: Project[] = [
  {
    id: '123',
    name: '프로젝트 A',
    steps: [
      {
        id: 1,
        name: '기획',
        items: [
          {
            id: 1,
            title: '놀라지 마세요',
            status: '진행 중',
            deadline: '2025-09-04',
            assignee: ['김태화', '두현우'],
          },
          {
            id: 2,
            title: 'mockData 입니다',
            status: '시작 전',
            deadline: '2025-09-07',
            assignee: ['김태화'],
          },
        ],
      },
      {
        id: 2,
        name: '디자인',
        items: [
          {
            id: 3,
            title: '^________^',
            status: '완료',
            deadline: '2025-10-10',
            assignee: ['김태화'],
          },
        ],
      },
    ],
  },
  {
    id: '456',
    name: '프로젝트 B',
    steps: [
      {
        id: 1,
        name: '기획',
        items: [
          {
            id: 1,
            title: 'Teamie 화이팅!',
            status: '진행 중',
            deadline: '2025-09-04',
            assignee: ['김태화', '이예린'],
          },
        ],
      },
    ],
  },
];
