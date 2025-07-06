'use client';

import Link from 'next/link';
import { useState } from 'react';
import { menus } from '@/constants/menus';
import { getHomeUrl, getNewUrl } from '@/utils/url';
import { mockProjects } from '@/constants/mockData';
import { SidebarMenus } from '@/types/sidebar';

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
    <nav className="w-full border-b-[2px] border-[#E7E7E7] bg-white h-[58px] z-10 relative">
      <div className="max-w-[1920px] mx-auto flex items-center h-full">
        <img src="/logo.svg" alt="Teamie 로고" className="h-[23px] mt-[1px] ml-[21px]" />

        <div className="flex items-center ml-[61px] gap-[60px] relative">
          {menuConfigs.map(({ label, key, urlFn }) => (
            <div key={key} className="relative">
              <button
                onClick={() => toggleMenu(key)}
                className={`flex items-center cursor-pointer ${
                  openMenu === key ? 'text-[#81D7D4]' : 'text-black'
                }`}
              >
                <span className="font-normal text-[18px]">{label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-[2px] w-[24px] h-[24px] ${openMenu === key ? 'rotate-180' : ''}`}
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

              {openMenu === key && (
                <ul className="absolute mt-[12px] bg-white rounded-[8px] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-20">
                  {key === 'projects'
                    ? mockProjects.map((project) => (
                        <li
                          key={project.id}
                          className="mx-[8px] border-b-[2px] border-[#BBBBBB] last:border-none"
                        >
                          <Link
                            href={`/projects/${project.id}`}
                            onClick={() => setOpenMenu(null)}
                            className="block pl-[12px] pr-[150px] py-[12px] text-[#505050] text-[18px] whitespace-nowrap"
                          >
                            {project.name}
                          </Link>
                        </li>
                      ))
                    : menus[key].map((item) => (
                        <li
                          key={item.path}
                          className="mx-[8px] border-b-[2px] border-[#BBBBBB] last:border-none"
                        >
                          <Link
                            href={urlFn!(item.path)}
                            onClick={() => setOpenMenu(null)}
                            className="block pl-[12px] pr-[150px] py-[12px] text-[#505050] text-[18px] whitespace-nowrap"
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

        <div className="flex items-center ml-auto mr-[30px]">
          <button className="w-[143px] h-[32px] bg-[#81D7D4] text-white rounded-[4px] text-sm font-bold text-[16px] mr-[36px]">
            pro로 업그레이드
          </button>
          <div className="w-[32px] h-[32px] rounded-full overflow-hidden">
            <img src="/icons/profile.svg" alt="프로필" className="w-full h-full" />
          </div>
        </div>
      </div>
    </nav>
  );
}
