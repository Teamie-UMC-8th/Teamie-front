import { SidebarMenus } from '@/types/sidebar';

export const menus: SidebarMenus = {
  home: [
    { name: '나의 캘린더', icon: '/icons/calendar.svg', path: 'calendar' },
    { name: '나의 업무', icon: '/icons/task.svg', path: 'tasks' },
  ],
  new: [
    { name: '프로젝트 생성', icon: '/icons/create-project.svg', path: 'create' },
    { name: '프로젝트 참여', icon: '/icons/join-project.svg', path: 'join' },
  ],
  projects: [
    { name: '프로젝트 홈', icon: '/icons/home.svg', path: '' },
    { name: '팀 캘린더', icon: '/icons/team-calendar.svg', path: 'calendar' },
    { name: '업무 대시보드', icon: '/icons/dashboard.svg', path: 'dashboard' },
    { name: '자료실', icon: '/icons/files.svg', path: 'files' },
    { name: '회고', icon: '/icons/retrospect.svg', path: 'retrospect' },
  ],
};
