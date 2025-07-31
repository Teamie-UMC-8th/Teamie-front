export function formatDate(date: Date | string | undefined): string {
  if (!date) return '마감일 없음';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '마감일 없음';

  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}월 ${day}일`;
}

// 날짜를 25.04~25.06 형식으로 포맷팅하는 함수
export const formatDateRange = (startDate: string, endDate: string): string => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startYear = start.getFullYear().toString().slice(-2); // 2025 -> 25
    const startMonth = (start.getMonth() + 1).toString().padStart(2, '0'); // 4 -> 04
    const endYear = end.getFullYear().toString().slice(-2);
    const endMonth = (end.getMonth() + 1).toString().padStart(2, '0');

    return `${startYear}.${startMonth}~${endYear}.${endMonth}`;
  } catch (error) {
    // 날짜 파싱에 실패하면 원본 문자열 반환
    return `${startDate}~${endDate}`;
  }
};
