export interface TaskItemProps {
  id: number;
  title: string;
  status: '시작 전' | '진행 중' | '완료';
  deadline: string;
  assignee?: string[];
}

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
            title: '기획서 초안 작성',
            status: '진행 중',
            deadline: '2024-05-04',
            assignee: ['홍길동', '이순신'],
          },
          {
            id: 2,
            title: '요구사항 정리',
            status: '시작 전',
            deadline: '2024-05-07',
          },
        ],
      },
      {
        id: 2,
        name: '디자인',
        items: [
          {
            id: 3,
            title: '와이어프레임 제작',
            status: '완료',
            deadline: '2024-05-10',
            assignee: ['김디자이너'],
          },
        ],
      },
    ],
  },
  {
    id: '456',
    name: '프로젝트 B',
    steps: [],
  },
];
