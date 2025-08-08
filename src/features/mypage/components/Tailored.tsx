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
    <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
      {data.data.map((correction: Correction) => (
        <Link
          key={correction.correctionId}
          href={`/mypage/tailoredportfolio/${correction.correctionId}`}
        >
          <button
            className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] grid justify-center cursor-pointer
            max-lg:w-[421px] max-lg:h-[180px]"
            style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
          >
            <div
              className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px]
            max-lg:w-[397px] max-lg:h-[40px] max-lg:ml-[22px]"
            >
              <p
                className="absolute text-[18px] left-[12px] truncate max-w-[80%]
              max-lg:text-[16px]"
              >
                {correction.title}
              </p>
            </div>

            <div className=" w-[439px] h-[60px]">
              <div className="flex mb-[12px]">
                <div
                  className="text-[16px] text-[#898989] ml-[14px] mr-[20px] w-[60px]
                max-lg:ml-[36px]"
                >
                  생성 일자
                </div>
                <div className="text-[16px] text-black text-left">
                  {formatDate(correction.createdAt)}
                </div>
              </div>
              <div className="flex">
                <div
                  className="text-[16px] text-[#898989] mr-[20px] w-[60px]
                max-lg:ml-[36px]"
                >
                  직무
                </div>
                <div className="text-[16px] text-black truncate flex-1 text-left">
                  {correction.jobTitle}
                </div>
              </div>
            </div>
          </button>
        </Link>
      ))}
    </div>
  );
}
