'use client';

import localFont from 'next/font/local';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body className="bg-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
