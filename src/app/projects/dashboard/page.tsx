import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center h-screen py-20">
      <h1 className="text-2xl font-bold mb-4">업무 대시보드</h1>
      <p className="text-gray-600">이런 식으로 페이지를 작성하시면 됩니다!</p>
      <Link href="/projects/dashboard/workdetail">
        <button className="mt-10  border border-[#BBBBBB]">업무 상세페이지</button>
      </Link>
    </div>
  );
}
