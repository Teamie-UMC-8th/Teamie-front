'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { menus } from '@/constants/menus';
import { getHomeUrl, getProjectUrl } from '../utils/url';
import { useActiveMenu } from '@/hooks/useActiveMenu';

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string | undefined;

  const activeMenu = useActiveMenu();

  // /new 경로에서는 사이드바 숨기기
  if (pathname === '/new') {
    return null;
  }

  const menuItems = menus[activeMenu];

  return (
    <aside className="w-[4.125rem] lg:w-[11.563rem] h-full bg-[#F8F8F8] border-r-[0.125rem] border-[#E7E7E7] flex flex-col py-[0.25rem] px-[0.125rem]">
      <nav className="flex flex-col text-[1.125rem]">
        {menuItems.map((item) => {
          let href = '';

          if (activeMenu === 'home') {
            href = getHomeUrl(item.path);
          } else if (activeMenu === 'projects') {
            href = getProjectUrl(projectId ?? '', item.path);
          }

          // '프로젝트 홈' 메뉴(path: '')은 정확히 일치할 때만 활성화 처리
          // 그 외 메뉴들은 하위 경로까지 포함해서 활성화 처리 (startsWith 사용)
          const isHome = item.path === '';
          const isActive = isHome ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={item.name}
              href={href}
              className={`flex items-center gap-0 lg:gap-[0.688rem] justify-center lg:justify-start px-[1rem] lg:px-[1.25rem] py-[1rem] rounded-[0.125rem]
                ${isActive ? 'bg-[#81D7D4] text-white font-bold' : 'text-black hover:bg-[#E7E7E7]'}
                transition
              `}
            >
              <img
                src={item.icon}
                alt=""
                className={`w-[1.75rem] h-[1.75rem] ${isActive ? 'brightness-0 invert' : ''}`}
              />
              <span className="hidden lg:inline">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
