'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { menus } from '@/constants/menus';
import { getHomeUrl } from '@/utils/url';
import { mockProjects } from '@/constants/mockData';
import { SidebarMenus } from '@/types/sidebar';
import Dropdown from './Dropdown';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menuKey: string) => {
    setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
    // 다른 드롭다운이 열려있으면 닫기
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
    // 다른 드롭다운이 열려있으면 닫기
    setOpenMenu(null);
  };

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 드롭다운 메뉴 영역 확인
      const dropdownMenus = document.querySelectorAll('[data-dropdown-menu]');
      const isClickInsideDropdown = Array.from(dropdownMenus).some((menu) => menu.contains(target));

      // 트리거 버튼인지 확인 (드롭다운을 토글하는 버튼들)
      const isTriggerButton = (target as Element).closest('[data-dropdown-trigger]') !== null;

      // navbar 영역 확인
      const navbar = navbarRef.current;
      const isClickInsideNavbar = navbar?.contains(target);

      // 드롭다운 메뉴 영역 밖을 클릭하고, 트리거 버튼이 아닌 경우에만 닫기
      if (!isClickInsideDropdown && (!isClickInsideNavbar || !isTriggerButton)) {
        setOpenMenu(null);
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  type MenuKey = keyof SidebarMenus;

  const menuConfigs: {
    label: string;
    key: MenuKey | 'projects';
    urlFn?: (path: string) => string;
    isDirectLink?: boolean;
  }[] = [
    { label: '홈', key: 'home', urlFn: getHomeUrl },
    { label: '프로젝트 생성', key: 'new', isDirectLink: true },
    { label: '나의 프로젝트', key: 'projects' },
  ];

  const upgradeButtonClick = () => {
    setIsUpgraded((prev) => !prev);
  };

  return (
    <nav
      className="w-full border-b-[0.125rem] border-[#E7E7E7] bg-white h-[3.625rem] z-10 relative"
      ref={navbarRef}
    >
      <div className="flex items-center h-full px-[1.313rem] min-w-[1024px]">
        {/* 로고 */}
        <img
          src="/logo.svg"
          alt="Teamie 로고"
          className="h-[1.438rem] mt-[0.063rem] mr-[3.75rem] shrink-0"
        />

        {/* 왼쪽 고정 영역 */}
        <div className="flex items-center gap-[3.75rem] shrink-0">
          {menuConfigs.map(({ label, key, urlFn, isDirectLink }) => {
            if (isDirectLink) {
              return (
                <Link
                  key={key}
                  href="/new"
                  className="flex items-center cursor-pointer whitespace-nowrap text-black hover:text-[#81D7D4]"
                >
                  <span className="font-normal text-[1.125rem]">{label}</span>
                </Link>
              );
            }

            // 드롭다운 아이템 생성
            const dropdownItems =
              key === 'projects'
                ? mockProjects.map((project) => ({
                    label: project.name,
                    href: `/projects/${project.id}`,
                  }))
                : menus[key].map((item) => ({
                    label: item.name,
                    href: urlFn!(item.path),
                  }));

            return (
              <Dropdown
                key={key}
                isOpen={openMenu === key}
                onToggle={() => toggleMenu(key)}
                trigger={
                  <button
                    data-dropdown-trigger
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
                }
                items={dropdownItems}
                width={
                  key === 'home'
                    ? 'w-[16.563rem]'
                    : key === 'projects'
                      ? 'w-[24.125rem]'
                      : 'w-[16.563rem]'
                }
              />
            );
          })}
        </div>

        {/* 길이 조절되는 부분*/}
        <div className="flex-1" />

        {/* 오른쪽 고정 영역 */}
        <div className="flex items-center gap-[2.25rem] shrink-0 mr-[0.563rem]">
          <button
            className="bg-[#81D7D4] text-white rounded-[0.25rem] text-sm font-bold text-[1rem] px-[0.75rem] py-[0.25rem] cursor-pointer"
            onClick={upgradeButtonClick}
          >
            {isUpgraded ? 'Credit 충전' : 'PRO로 업그레이드'}
          </button>
          <Dropdown
            isOpen={isProfileDropdownOpen}
            onToggle={toggleProfileDropdown}
            trigger={
              <button data-dropdown-trigger className="flex items-center">
                <img src="/icons/profile.svg" alt="프로필" className="cursor-pointer" />
              </button>
            }
            items={[
              {
                label: '마이페이지',
                href: '/mypage',
                icon: '/icons/myPage-dropdown.svg',
              },
              {
                label: '로그아웃',
                href: '/login',
                icon: '/icons/logout.svg',
              },
            ]}
            className="mr-[1rem]"
            dropdownClassName="right-[0.25rem] top-[2rem]"
            width="w-[16.563rem]"
          />
        </div>
      </div>
    </nav>
  );
}
