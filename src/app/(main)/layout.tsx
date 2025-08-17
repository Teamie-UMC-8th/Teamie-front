'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />
      <div className="flex h-screen pt-[3.625rem]">
        <div className="h-full flex-none">
          <Sidebar />
        </div>
        <main
          className="flex-1 min-w-[1024px] py-[3.75rem] overflow-y-auto ml-[4.125rem] lg:ml-[11.563rem]"
          style={{
            paddingLeft: 'clamp(1.5rem, calc(15.179vw - 8.214rem), 7.5rem)',
            paddingRight: 'clamp(1.5rem, calc(15.179vw - 8.214rem), 7.5rem)',
            height: 'calc(100vh - 3.625rem)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
