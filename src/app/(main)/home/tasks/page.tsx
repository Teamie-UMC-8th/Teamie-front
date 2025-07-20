'use client';

import MyTaskBoard from '@/features/boards/MyTaskBoard';

export default function TaskPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between pb-[16px] px-[8px] border-b-[2px] border-[#E7E7E7]">
        <h1 className="text-[24px] font-bold">나의 업무</h1>
      </header>

      <main>
        <MyTaskBoard />
      </main>
    </div>
  );
}
