'use client';

import { UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Teamie 로고" className="h-8" />
        </div>
        <div className="flex items-center gap-2 ml-6">
          {/* Todos: 버튼 ->  드롭다운 메뉴 컴포넌트*/}
          <button className="text-black hover:text-[#81D7D4] font-medium px-2">홈 ▼</button>
          <button className="text-black hover:text-[#81D7D4] font-medium px-2">
            프로젝트 추가 ▼
          </button>
          <button className="text-black hover:text-[#81D7D4] font-medium px-2">
            나의 프로젝트 ▼
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-[#81D7D4] text-white px-4 py-1.5 rounded-md text-sm font-bold">
          pro로 업그레이드
        </button>
        <UserCircle className="w-8 h-8 text-gray-400" />
      </div>
    </nav>
  );
}
