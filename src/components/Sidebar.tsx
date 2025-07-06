'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuKey, SidebarMenus } from '@/types/sidebar';

export default function Sidebar() {
  const pathname = usePathname();

  const menus: SidebarMenus = {
    home: [
      { name: '나의 캘린더', icon: '/icons/calendar.svg', href: '/home/calendar' },
      { name: '나의 업무', icon: '/icons/task.svg', href: '/home/tasks' },
    ],
    new: [
      { name: '프로젝트 생성', icon: '/icons/create-project.svg', href: '/new/create' },
      { name: '프로젝트 참여', icon: '/icons/join-project.svg', href: '/new/join' },
    ],
    projects: [
      { name: '프로젝트 홈', icon: '/icons/home.svg', href: '/projects/home' },
      { name: '팀 캘린더', icon: '/icons/team-calendar.svg', href: '/projects/calendar' },
      { name: '업무 대시보드', icon: '/icons/dashboard.svg', href: '/projects/dashboard' },
      { name: '자료실', icon: '/icons/files.svg', href: '/projects/files' },
      { name: '회고', icon: '/icons/retrospect.svg', href: '/projects/retrospect' },
    ],
  };

  const activeMenu: MenuKey = pathname.startsWith('/new')
    ? 'new'
    : pathname.startsWith('/projects')
      ? 'projects'
      : 'home';

  const menuItems = menus[activeMenu];

  return (
    <aside className="w-[183px] h-full bg-[#F8F8F8] border-r-[2px] border-[#E7E7E7] flex flex-col py-[4px] px-[2px]">
      <nav className="flex flex-col text-[18px]">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-[11px] px-[20px] py-[16px] rounded-[2px]
              ${pathname === item.href ? 'bg-[#81D7D4] text-white font-bold' : 'text-black hover:bg-[#E7E7E7]'}
              transition
            `}
          >
            <img
              src={item.icon}
              alt=""
              className={`w-[28px] h-[28px] ${pathname === item.href ? 'brightness-0 invert' : ''}`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
