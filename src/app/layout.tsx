'use client';

import localFont from 'next/font/local';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith('/mypage');

  return (
    <html lang="ko" className={pretendard.className}>
      <body className="bg-white">
        <Navbar />
        <div className="flex min-h-screen">
          <div className="w-[185px] min-h-screen flex-none">
            <Sidebar />
          </div>
          <main className="flex-1 px-[120px] py-[60px]">{children}</main>
        </div>
      </body>
    </html>
  );
}
