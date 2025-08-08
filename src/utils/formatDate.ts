export function formatDate(date: Date | string | undefined): string {
  if (!date) return '날짜 없음';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '날짜 없음';

  const year = d.getFullYear().toString().slice(-2); // 2025 -> 25
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // 4 -> 04
  const day = d.getDate().toString().padStart(2, '0');

  return `${year}.${month}.${day}`;
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
    console.error('Invalid date string:', startDate, endDate, error);
    return `${startDate}~${endDate}`;
  }
};

export const formatToKoreanDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작합니다.
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일까지`;
  } catch (error) {
    console.error('Invalid date string:', dateString, error);
    return '날짜 정보 없음';
  }
};
