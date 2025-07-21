'use client';

import localFont from 'next/font/local';
import '../../styles/globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body className="bg-white overflow-x-hidden">
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
      </body>
    </html>
  );
}
