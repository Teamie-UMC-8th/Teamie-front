'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { menus } from '@/constants/menus';
import { getHomeUrl, getNewUrl, getProjectUrl } from '../utils/url';
import { useActiveMenu } from '@/hooks/useActiveMenu';

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string | undefined;

  const activeMenu = useActiveMenu();

  const menuItems = menus[activeMenu];

  return (
    <aside className="w-[183px] h-full bg-[#F8F8F8] border-r-[2px] border-[#E7E7E7] flex flex-col py-[4px] px-[2px]">
      <nav className="flex flex-col text-[18px]">
        {menuItems.map((item) => {
          let href = '';

          if (activeMenu === 'home') {
            href = getHomeUrl(item.path);
          } else if (activeMenu === 'new') {
            href = getNewUrl(item.path);
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
              className={`flex items-center gap-[11px] px-[20px] py-[16px] rounded-[2px]
                ${isActive ? 'bg-[#81D7D4] text-white font-bold' : 'text-black hover:bg-[#E7E7E7]'}
                transition
              `}
            >
              <img
                src={item.icon}
                alt=""
                className={`w-[28px] h-[28px] ${isActive ? 'brightness-0 invert' : ''}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
