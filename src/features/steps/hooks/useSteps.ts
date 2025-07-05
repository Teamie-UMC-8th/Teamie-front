'use client';

import { useState } from 'react';

interface StepItem {
  id: number;
  title: string;
  status: '시작 전' | '진행 중' | '완료';
  deadline: string;
  assignee?: string;
}

interface Step {
  id: number;
  name: string;
  items: StepItem[];
}

const initialSteps: Step[] = [
  {
    id: 1,
    name: '기획',
    items: [
      {
        id: 1,
        title: '기획서 초안 작성',
        status: '진행 중',
        deadline: '2024-05-04',
        assignee: '홍길동',
      },
      { id: 2, title: '요구사항 정리', status: '시작 전', deadline: '2024-05-07' },
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
        assignee: '김디자이너',
      },
    ],
  },
];

export function useSteps() {
  // TODO: 목데이터 -> 서버 데이터로 변경
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [openStepIds, setOpenStepIds] = useState<number[]>([]);

  const toggleStep = (id: number) => {
    setOpenStepIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const addStep = () => {
    const newId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    // TODO: 이름 설정할 수 있도록
    setSteps([...steps, { id: newId, name: `새 STEP ${newId}`, items: [] }]);
  };

  return {
    steps,
    openStepIds,
    toggleStep,
    addStep,
  };
}
