'use client';

import { useState } from 'react';
import { Step } from '@/constants/mockData';

// 드래그앤드롭으로 Task를 이동할 때 상태 업데이트
export function useSteps(initialSteps: Step[]) {
  const [openStepIds, setOpenStepIds] = useState<number[]>([]);

  // Step들의 데이터를 저장하는 상태
  // 드래그앤드롭으로 Task가 이동할 때마다 이 상태가 업데이트됨
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  const toggleStep = (id: number) => {
    setOpenStepIds((prev) =>
      // 이미 열려있으면 제거하고, 닫혀있으면 추가
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // 새로운 Step을 추가하는 함수
  // "+ STEP 추가" 버튼을 클릭했을 때 호출됨
  const addStep = () => {
    // TODO: 이름 유저가 설정할 수 있도록 하기
    // 새로운 Step의 ID를 생성 (기존 ID 중 가장 큰 값 + 1)
    const newId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;

    // 새로운 Step을 배열 맨 뒤에 추가
    setSteps([...steps, { id: newId, name: `새 STEP ${newId}`, items: [] }]);
  };

  // Task STEP 변경 함수
  // sourceStepId: Task가 있던 Step의 ID
  // destStepId: Task를 옮길 Step의 ID
  // sourceIndex: Task가 있던 위치
  // destIndex: Task를 옮길 위치
  const moveTask = (
    sourceStepId: number,
    destStepId: number,
    sourceIndex: number,
    destIndex: number
  ) => {
    setSteps((prevSteps) => {
      // Task가 있던 Step과 옮길 Step을 찾음
      const sourceStep = prevSteps.find((s) => s.id === sourceStepId);
      const destStep = prevSteps.find((s) => s.id === destStepId);

      // Step을 찾지 못했으면 기존 상태 그대로 반환
      if (!sourceStep || !destStep) return prevSteps;

      // 같은 Step 내에서 이동
      if (sourceStepId === destStepId) {
        const taskList = [...sourceStep.items];
        const [movedTask] = taskList.splice(sourceIndex, 1);
        if (!movedTask) return prevSteps;

        // slice로 새 배열을 만들어 정확한 위치에 삽입
        const newTaskList = [
          ...taskList.slice(0, destIndex),
          movedTask,
          ...taskList.slice(destIndex),
        ];

        const newStep = { ...sourceStep, items: newTaskList };
        return prevSteps.map((step) => (step.id === sourceStepId ? newStep : step));
      }

      // Task가 있던 Step에서 Task를 제거
      const taskList = [...sourceStep.items];
      const [movedTask] = taskList.splice(sourceIndex, 1);

      // Task를 찾지 못했으면 기존 상태 그대로 반환
      if (!movedTask) return prevSteps;

      // Task가 제거된 새로운 sourceStep 생성
      const newSourceStep = { ...sourceStep, items: taskList };

      // Task를 추가할 새로운 destStep 생성
      const newDestItems = [...destStep.items];
      newDestItems.splice(destIndex, 0, movedTask); // destIndex 위치에 Task 삽입
      const newDestStep = { ...destStep, items: newDestItems };

      // 전체 steps 배열을 업데이트
      // sourceStep과 destStep만 새로운 값으로 교체
      return prevSteps.map((step) => {
        if (step.id === sourceStepId) return newSourceStep;
        if (step.id === destStepId) return newDestStep;
        return step;
      });
    });
  };

  return {
    steps,
    openStepIds,
    toggleStep,
    addStep,
    moveTask,
  };
}
