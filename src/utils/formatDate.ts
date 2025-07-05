export function formatDate(date: Date | string | undefined): string {
  if (!date) return '마감일 없음';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '마감일 없음';

  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}월 ${day}일`;
}
