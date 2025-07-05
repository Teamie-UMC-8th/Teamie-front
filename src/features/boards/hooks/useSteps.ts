'use client';

import { mockSteps, Step } from '@/constants/mockData';
import { useState } from 'react';

export function useSteps() {
  // TODO: 목데이터 -> 서버 데이터로 변경
  const [steps, setSteps] = useState<Step[]>(mockSteps);
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
