'use client';

import { useState } from 'react';
import { Step } from '@/constants/mockData';

export function useSteps(initialSteps: Step[]) {
  const [openStepIds, setOpenStepIds] = useState<number[]>([]);
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  const toggleStep = (id: number) => {
    setOpenStepIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const addStep = () => {
    const newId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, name: `새 STEP ${newId}`, items: [] }]);
  };

  return {
    steps,
    openStepIds,
    toggleStep,
    addStep,
  };
}
