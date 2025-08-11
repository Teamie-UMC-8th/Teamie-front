'use client';

import Link from 'next/dist/client/link';
import { useCorrectionList } from '@/hooks/mutations/useGetCorrection';
import { formatDate } from '@/utils/formatDate';
import { Correction } from '@/types/api/correction';

export default function Tailored() {
  const { data, isLoading, error } = useCorrectionList();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
        <div className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] flex items-center justify-center max-lg:w-[421px] max-lg:h-[180px]">
          <div className="text-[16px] text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
        <div className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] flex items-center justify-center max-lg:w-[421px] max-lg:h-[180px]">
          <div className="text-[16px] text-red-500">데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
        <div className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] flex items-center justify-center max-lg:w-[421px] max-lg:h-[180px]">
          <div className="text-[16px] text-gray-500">AI 첨삭 내역이 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 max-lg:w-[868px] gap-[24px] max-lg:grid-cols-2">
      {data.data.map((correction: Correction) => (
        <Link
          key={correction.correctionId}
          href={`/mypage/tailoredportfolio/${correction.correctionId}`}
        >
          <button
            className="bg-[#F8F8F8] w-[465px] h-[190px] rounded-[8px] px-[13px] cursor-pointer
            max-lg:w-[421px] max-lg:h-[180px]"
            style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
          >
            {/* 제목 영역 */}
            <div className="bg-white w-full h-[48px] rounded-[4px] border border-[#E7E7E7] flex items-center px-[12px] mb-[16px]">
              <p className="text-[18px] text-black truncate">{correction.title}</p>
            </div>

            {/* 정보 영역 */}
            <div className="space-y-[12px] ml-[12px]">
              <div className="flex items-center">
                <span className="text-[16px] text-[#505050] w-[60px] text-left">생성 일자</span>
                <span className="text-[16px] text-black ml-[16px]">
                  {formatDate(correction.createdAt)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-[16px] text-[#505050] w-[60px] text-left">기업명</span>
                <span className="text-[16px] text-black ml-[16px] truncate">
                  {correction.title.split(' ')[0] || '기업명'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-[16px] text-[#505050] w-[60px] text-left">직무명</span>
                <span className="text-[16px] text-black ml-[16px] truncate">
                  {correction.jobTitle}
                </span>
              </div>
            </div>
          </button>
        </Link>
      ))}
    </div>
  );
}
