'use client';

import { Searchbar } from '@/components/Searchbar';
import ToggleButton from '@/components/ToggleButton';
import StepsBoard from '@/features/steps/StepsBoard';

export default function DashboardPage() {
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
        onToggle={(isLeftSelected) => {
          console.log(isLeftSelected ? 'STEP' : '진행 상태');
        }}
      />

      <main className="flex-1 overflow-x-auto">
        <StepsBoard />
      </main>
    </div>
  );
}
