'use client';

import { useState } from 'react';

// UI 상태만 관리하는 훅
export function useSteps() {
  const [openStepIds, setOpenStepIds] = useState<number[]>([]);

  const toggleStep = (id: number) => {
    setOpenStepIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return {
    openStepIds,
    toggleStep,
  };
}
