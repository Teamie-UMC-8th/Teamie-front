import { UserProfile } from '@/types/api/user';

export const getProfileImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/icons/profile.svg';

  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    return '/icons/profile.svg';
  }
};

// 이미지 에러 핸들러
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/icons/profile.svg';
};

// 드롭다운 아이콘용 (마이페이지 메뉴)
export const getDropdownIcon = (user: UserProfile | null): string => {
  const profileImage = getProfileImageUrl(user?.imageUrl);
  return profileImage !== '/icons/profile.svg' ? profileImage : '/icons/myPage-dropdown.svg';
};
