'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { menus } from '@/constants/menus';
import { getHomeUrl } from '@/utils/url';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarMenus } from '@/types/sidebar';
import Dropdown from './Dropdown';
import Image from 'next/image';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('나의 프로젝트');
  const navbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout, isUpgraded, setIsUpgraded } = useAuth(); // AuthContext에서 사용자 정보와 로그아웃 함수, pro 업그레이드 상태 가져오기

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

  const handleProjectSelect = (projectName: string) => {
    setSelectedProject(projectName);
    setOpenMenu(null);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
      // 로그아웃 성공 시 드롭다운 닫기
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error('로그아웃 처리 중 오류 발생:', error);
    }
  };

  // 경로 변경 시 프로젝트 페이지가 아니면 selectedProject 리셋
  useEffect(() => {
    const isProjectPage = pathname.startsWith('/projects/');
    if (!isProjectPage) {
      setSelectedProject('나의 프로젝트');
    }
  }, [pathname]);

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
    setIsUpgraded(!isUpgraded);
  };

  return (
    <nav
      className="w-full border-b-[0.125rem] border-[#E7E7E7] bg-white h-[3.625rem] z-10 fixed top-0 left-0"
      ref={navbarRef}
    >
      <div className="flex items-center h-full pl-[1.313rem] min-w-[1024px]">
        {/* 로고 */}
        <Image
          src="/logo.svg"
          alt="Teamie 로고"
          className="h-[1.438rem] mt-[0.063rem] mr-[3.75rem] shrink-0"
          width={149}
          height={23}
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

            // 프로젝트 드롭다운이면 user가 없으면 빈 배열 반환
            const dropdownItems =
              key === 'projects'
                ? (user?.projects || []).map((project) => ({
                    label: project.name,
                    href: `/projects/${project.id}`,
                    onClick: () => handleProjectSelect(project.name),
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
                    <span className="font-normal text-[1.125rem]">
                      {key === 'projects' ? selectedProject : label}
                    </span>
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
                <Image
                  src={user?.imageUrl || '/icons/profile.svg'}
                  alt="프로필"
                  className="cursor-pointer rounded-full object-cover w-[32px] h-[32px]"
                  width={32}
                  height={32}
                />
              </button>
            }
            items={[
              {
                label: '마이페이지',
                href: '/myPage',
                icon: user?.imageUrl ? user.imageUrl : '/icons/myPage-dropdown.svg',
              },
              {
                label: '로그아웃',
                href: '/login',
                icon: '/icons/logout.svg',
                onClick: handleLogout,
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
