'use client';

import { useMasterPortfolioList } from '@/hooks/mutations/usePatchMasterPortfolio';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatDateRange } from '@/utils/formatDate';

export default function Projects() {
  const pathname = usePathname();
  const isAnalyzeFinPage = pathname === '/mypage/addcorrection/projectSelect';
  const isMyPage = pathname === '/mypage';
  const { data } = useMasterPortfolioList();

  return (
    <div className={`grid grid-cols-2 gap-[24px] ${!isMyPage ? 'max-lg:grid-cols-1' : ''}`}>
      {data?.data.map((item) => (
        <Link
          key={item.portfolioId}
          href={{
            pathname: `/mypage/aimasterportfolio/${item.portfolioId}`,
            query: { projectId: item.projectId },
          }}
        >
          <button
            className={`bg-[#F8F8F8] w-[465px] h-[192px] rounded-[8px] grid justify-center cursor-pointer
              ${!isAnalyzeFinPage && 'max-lg:w-[421px] max-lg:h-[180px]'}`}
            style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
          >
            <div
              className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px] mx-[13px]
              max-lg:w-[397px] max-lg:h-[40px] max-lg:ml-[12px]"
            >
              <p className="absolute text-[18px] left-[12px] max-lg:text-[16px] truncate max-w-[60%]">
                {item.projectName}
              </p>
              <div
                className={`absolute right-[8px] ${
                  item.category === '동아리' ? 'bg-[#CDE3C9]' : 'bg-[#FBD5D5]'
                } w-[80px] h-[32px] rounded-[4px] flex items-center justify-center max-lg:right-[4px]`}
              >
                <span className="text-[16px]">{item.category}</span>
              </div>
            </div>

            <div className="w-[439px] h-[96px] mx-[13px] pt-[16px] pb-[20px] mt-[-36px] max-lg:w-[397px] max-lg:h-[96px] max-lg:ml-[12px]">
              <div className="flex mb-[12px]">
                <div className="text-[16px] text-[#898989] mr-[38px] ml-[12px] ">기여도</div>
                <div className="text-[16px] text-black mr-[24px]">{item.contributionRate}%</div>
                <img src="/icons/percent-bar.svg" alt="Percent Bar" className="max-lg:w-[247px]" />
              </div>
              <div className="flex mb-[12px]">
                <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px] ">진행 기간</div>
                <div className="text-[16px] text-black truncate flex-1 text-left">
                  {formatDateRange(item.startDate, item.endDate)}
                </div>
              </div>
              <div className="flex">
                <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px] ">주요 업무</div>
                <div className="text-[16px] text-black truncate flex-1">{item.mainTask}</div>
              </div>
            </div>
          </button>
        </Link>
      ))}
    </div>
  );
}
