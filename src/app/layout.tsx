import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
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
