'use client';

import Link from 'next/link';

export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center h-screen py-20">
      <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
      <p className="text-gray-600">이런 식으로 페이지를 작성하시면 됩니다!</p>
      <Link href="/mypage/aiportfolio">
        <button className="mt-10  border border-[#BBBBBB]">AI포트폴리오</button>
      </Link>
    </div>
  );
}
