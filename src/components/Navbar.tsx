'use client';

import Link from 'next/link';
import { useState } from 'react';
import { menus } from '@/constants/menus';
import { getHomeUrl, getNewUrl } from '@/utils/url';
import { mockProjects } from '@/constants/mockData';
import { SidebarMenus } from '@/types/sidebar';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menuKey: string) => {
    setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  type MenuKey = keyof SidebarMenus;

  const menuConfigs: {
    label: string;
    key: MenuKey | 'projects';
    urlFn?: (path: string) => string;
  }[] = [
    { label: '홈', key: 'home', urlFn: getHomeUrl },
    { label: '프로젝트 추가', key: 'new', urlFn: getNewUrl },
    { label: '나의 프로젝트', key: 'projects' },
  ];

  return (
    <nav className="w-full border-b-[0.125rem] border-[#E7E7E7] bg-white h-[3.625rem] z-10 relative">
      <div className="flex items-center h-full px-[1.313rem] min-w-tablet">
        {/* 로고 */}
        <img
          src="/logo.svg"
          alt="Teamie 로고"
          className="h-[1.438rem] mt-[0.063rem] mr-[3.75rem] shrink-0"
        />

        {/* 왼쪽 고정 영역 */}
        <div className="flex items-center gap-[3.75rem] shrink-0">
          {menuConfigs.map(({ label, key, urlFn }) => (
            <div key={key} className="relative">
              <button
                onClick={() => toggleMenu(key)}
                className={`flex items-center cursor-pointer whitespace-nowrap ${
                  openMenu === key ? 'text-[#81D7D4]' : 'text-black'
                }`}
              >
                <span className="font-normal text-[1.125rem]">{label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-[0.125rem] w-[1.5rem] h-[1.5rem] ${openMenu === key ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>

              {/* 드롭다운 */}
              {openMenu === key && (
                <ul className="absolute mt-[0.75rem] bg-white rounded-[0.5rem] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-20">
                  {key === 'projects'
                    ? mockProjects.map((project) => (
                        <li
                          key={project.id}
                          className="mx-[0.5rem] border-b-[0.125rem] border-[#BBBBBB] last:border-none"
                        >
                          <Link
                            href={`/projects/${project.id}`}
                            onClick={() => setOpenMenu(null)}
                            className="block pl-[0.75rem] pr-[9.375rem] py-[0.75rem] text-[#505050] text-[1.125rem] whitespace-nowrap"
                          >
                            {project.name}
                          </Link>
                        </li>
                      ))
                    : menus[key].map((item) => (
                        <li
                          key={item.path}
                          className="mx-[0.5rem] border-b-[0.125rem] border-[#BBBBBB] last:border-none"
                        >
                          <Link
                            href={urlFn!(item.path)}
                            onClick={() => setOpenMenu(null)}
                            className="block pl-[0.75rem] pr-[9.375rem] py-[0.75rem] text-[#505050] text-[1.125rem] whitespace-nowrap"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* 길이 조절되는 부분*/}
        <div className="flex-1" />

        {/* 오른쪽 고정 영역 */}
        <div className="flex items-center gap-[2.25rem] shrink-0 mr-[0.563rem]">
          <button className="w-[8.938rem] h-[2rem] bg-[#81D7D4] text-white rounded-[0.25rem] text-sm font-bold text-[1rem]">
            pro로 업그레이드
          </button>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
