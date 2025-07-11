'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Searchbar } from '@/components/Searchbar';
import ToggleButton from '@/components/ToggleButton';
import StepsBoard from '@/features/boards/StepsBoard';
import StatusBoard from '@/features/boards/StatusBoard';
import { mockProjects } from '@/constants/mockData';

export default function DashboardPage() {
  // 상태 관리: STEP 별로 보기 / 진행 상태별로 보기
  const [isStepView, setIsStepView] = useState(true);
  // 프로젝트 ID 파라미터 가져오기
  const { projectId } = useParams() as { projectId: string };

  // TODO: 목데이터가 아닌 실제 데이터로 대체
  const project = mockProjects.find((p) => p.id === projectId);
  const steps = project?.steps ?? [];

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <header className="flex items-center justify-between pb-[16px] px-[8px] border-b-[2px] border-[#E7E7E7]">
        <h1 className="text-[24px] font-bold">업무 대시보드</h1>
        <Searchbar
          placeholder="검색어를 입력하세요."
          onChange={() => {}}
          onFilterClick={() => {}}
        />
      </header>

      <ToggleButton
        leftLabel="STEP 별로 보기"
        rightLabel="진행 상태별로 보기"
        onToggle={(isLeftSelected) => setIsStepView(isLeftSelected)}
      />

      <main className="flex-1 overflow-x-auto">
        {isStepView ? (
          <StepsBoard steps={steps} projectId={projectId} />
        ) : (
          <StatusBoard steps={steps} projectId={projectId} />
        )}
      </main>
    </div>
  );
}
