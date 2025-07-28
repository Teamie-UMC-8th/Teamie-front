'use client';

import { useState } from 'react';
import DayPicker from '@/components/DayPicker';
import MemberCard from '@/components/MemberCard';
import Image from 'next/image';

export default function ProjectHomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen py-20 px-8">
      <h1 className="text-[24px] font-bold mb-4">프로젝트 홈</h1>
      <hr className="w-full border-t mb-8" style={{ borderColor: '#E7E7E7' }} />
      <div className="flex flex-row gap-[29px] mb-4">
        {/* 게시판 */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">게시판</h2>
          <div
            className="w-[920px] h-[344px] pl-[40px] pt-[40px] pr-4 pb-4 border border-[#BBBBBB] rounded-lg bg-white flex flex-col cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex flex-row gap-12 mb-6">
              {[...Array(5)].map((_, idx) => (
                <img
                  key={`postit-row1-${idx}`}
                  src="/icons/post-it.svg"
                  alt="Post-it Icon"
                  className="w-[120px] h-[120px]"
                />
              ))}
            </div>
            <div className="flex flex-row gap-12 ml-[20px]">
              {[...Array(5)].map((_, idx) => (
                <img
                  key={`postit-row2-${idx}`}
                  src="/icons/post-it.svg"
                  alt="Post-it Icon"
                  className="w-[120px] h-[120px]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* 업데이트 */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">업데이트</h2>
          <div className="w-[466px] h-[344px] p-4 border border-[#BBBBBB] rounded-lg bg-white">
            <p className="text-gray-600">업데이트 내용을 여기에 작성하세요.</p>
          </div>
        </div>
      </div>

      <div style={{ height: '132px' }} />
      <div className="flex flex-row gap-[42px] mb-12">
        {/* 목표 */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">우리 팀의 목표</h2>
          <textarea
            className="w-[688px] h-[232px] p-3 border border-[#BBBBBB] rounded-lg resize-none"
            placeholder="우리팀의 목표를 작성해주세요..."
          />
        </div>

        {/* 규칙 */}
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <h3 className="text-xl font-bold mb-2">우리팀의 규칙</h3>
            <h3 className="text-xl font-normal mb-2 text-gray-600/70">+ 전체보기</h3>
          </div>
          <textarea
            className="w-[688px] h-[232px] p-3 border border-[#BBBBBB] rounded-lg resize-none"
            placeholder="우리팀의 규칙을 작성해주세요..."
          />
        </div>
      </div>

      {/* 팀원 프로필 */}
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold mb-5">팀원 프로필</h2>
          <button className="w-[91px] h-[34px] bg-[#81D7D4] text-white rounded-[0.25rem] text-sm font-bold text-[1rem]">
            팀원 추가
          </button>
        </div>
        <div className="flex flex-row gap-13 mb-8">
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
        </div>
      </div>

      {/* 모달창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40">
          <div className="bg-white w-[599px] h-[364px] rounded-lg shadow-lg relative flex flex-col items-center">
            {/* 닫기 버튼 */}
            <Image
              src="/icons/close.svg"
              alt="Close"
              width={24}
              height={24}
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />

            {/* 제목 */}
            <h1 className="text-lg font-bold text-center mt-[60px] mb-2">
              게시판에 메모를 남겨주세요.
            </h1>

            {/* 설명문 */}
            <p className="text-sm text-gray-500 text-center mb-[20px]">
              포스트잇은 48시간 뒤 자동 삭제되며, 본인이 작성한 메모는 직접 삭제할 수 있어요.
            </p>

            {/* 텍스트 영역 */}
            <textarea
              className="w-4/5 h-28 border border-[#BBBBBB] rounded-lg p-3 resize-none mb-[32px]"
              placeholder="텍스트를 입력하세요..."
            />

            {/* 저장 버튼 */}
            <button className="w-[183px] h-[34px] bg-[#81D7D4] text-white rounded-[0.25rem] font-bold mb-[44px]">
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
