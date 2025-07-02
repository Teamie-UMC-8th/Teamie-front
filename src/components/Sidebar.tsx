'use client';

import { Calendar, List } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menu = [
  // Todo: 임의로 설정한 주소 -> 추후 변경
  { name: '나의 캘린더', icon: <Calendar className="w-5 h-5" />, href: '/calendar' },
  { name: '나의 업무', icon: <List className="w-5 h-5" />, href: '/tasks' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 h-screen bg-gray-50 border-r border-gray-200 flex flex-col py-1 px-1">
      <nav className="flex flex-col">
        {/* Todo: 사이드바 메뉴 아이템 -> 컴포넌트화 */}
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-3 text-gray-700 font-medium hover:bg-[#81D7D4] transition
              ${pathname === item.href ? 'bg-[#81D7D4] font-bold text-white' : ''}`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
