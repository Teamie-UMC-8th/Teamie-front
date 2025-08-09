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

  // 새로 생성된 스텝을 자동으로 열기
  const openStep = (id: number) => {
    setOpenStepIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return {
    openStepIds,
    toggleStep,
    openStep,
  };
}
