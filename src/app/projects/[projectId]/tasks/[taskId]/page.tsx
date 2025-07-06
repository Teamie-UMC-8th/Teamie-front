'use client';

import { useState } from 'react';
import { Searchbar } from '@/components/Searchbar';
import ToggleButton from '@/components/ToggleButton';
import StepsBoard from '@/features/boards/StepsBoard';
import StatusBoard from '@/features/boards/StatusBoard';

export default function DashboardPage() {
  const [isStepView, setIsStepView] = useState(true);

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
        {isStepView ? <StepsBoard /> : <StatusBoard />}
      </main>
    </div>
  );
}
