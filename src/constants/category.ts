export const CATEGORY_MAP = {
  COURSE: { label: '수업', color: '#BED9FB' },
  CLUB: { label: '동아리', color: '#CDE3C9' },
  ACTIVITY: { label: '대외활동', color: '#F7DFC4' },
  PROJECT: { label: '프로젝트', color: '#FBD5D5' },
  OTHER: { label: '기타', color: '#C8C8C8' },
} as const;

export type CategoryKey = keyof typeof CATEGORY_MAP;

export const CATEGORY_LIST = Object.entries(CATEGORY_MAP).map(([key, value]) => ({
  value: key as CategoryKey,
  ...value,
}));
