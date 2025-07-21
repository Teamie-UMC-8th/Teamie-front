'use client';

import MyTaskBoard from '@/features/boards/MyTaskBoard';

export default function TaskPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between pb-[1rem] px-[0.5rem] border-b-[0.125rem] border-[#E7E7E7]">
        <h1 className="text-[1.375rem] lg:text-[1.5rem] font-semibold lg:font-bold">나의 업무</h1>
      </header>

      <main>
        <MyTaskBoard />
      </main>
    </div>
  );
}
