'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // 가로 스크롤 바 생성 시 레이아웃이 어색해지는 문제 있음, 스크롤 유지 여부에 대한 논의 필요
    <div className="bg-white overflow-x-hidden">
      <Navbar />
      <div className="flex min-h-screen">
        <div className="min-h-screen flex-none">
          <Sidebar />
        </div>
        <main
          className="flex-1 min-w-[1024px] py-[3.75rem]"
          style={{
            /* 패딩 - 1920px 기준 120px, 1024px 기준 24px */
            paddingLeft: 'clamp(1.5rem, calc(15.179vw - 8.214rem), 7.5rem)',
            paddingRight: 'clamp(1.5rem, calc(15.179vw - 8.214rem), 7.5rem)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
