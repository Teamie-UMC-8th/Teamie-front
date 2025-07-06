import { usePathname } from 'next/navigation';
import { MenuKey } from '@/types/sidebar';

export function useActiveMenu(): MenuKey {
  const pathname = usePathname();

  if (pathname.startsWith('/new')) return 'new';
  if (pathname.startsWith('/projects')) return 'projects';
  return 'home';
}
