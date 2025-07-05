export type MenuKey = 'home' | 'new' | 'projects';

export interface SidebarMenuItem {
  name: string;
  icon: string;
  href: string;
}

export type SidebarMenus = Record<MenuKey, SidebarMenuItem[]>;
