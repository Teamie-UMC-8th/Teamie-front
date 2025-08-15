'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const CorrectionSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-[0px] left-0 bg-white w-[281px] h-screen"
      style={{ boxShadow: '4px 0px 3px 0px #0000000D' }}
    >
      <div className="flex items-center ml-[152px] mt-[80px]">
        <Link href="/mypage">
          <Image
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            width={28}
            height={28}
            className="cursor-pointer mr-[12px]"
          />
        </Link>
        <p className="text-[18px]">돌아가기</p>
      </div>

      {/* 기업 분석 정보 */}
      {(pathname.includes('correctionIntro') ||
        pathname.includes('analyzing') ||
        pathname.includes('analyzefin')) && (
        <div className="mt-[92px] ml-[40px]">
          <Image src="/icons/EnterAnalyze.svg" alt="기업 분석 정보" width={162} height={32} />
          <Image
            src="/icons/ShortVLine.svg"
            alt="구분선"
            width={2}
            height={46}
            className="ml-[16px] mb-[8px] mt-[2px]"
          />
          <Image src="/icons/ProjectSelectOff.svg" alt="프로젝트 선택" width={157} height={32} />
        </div>
      )}

      {/* 프로젝트 선택 */}
      {pathname.includes('projectSelect') && (
        <div className="mt-[92px] ml-[40px]">
          <Image src="/icons/EnterAnalyzeOff.svg" alt="기업 정보 분석" width={162} height={32} />
          <Image
            src="/icons/ShortVLine.svg"
            alt="구분선"
            width={2}
            height={46}
            className="ml-[16px] mb-[8px] mt-[2px]"
          />
          <Image src="/icons/ProjectSelect.svg" alt="프로젝트 선택" width={157} height={32} />
        </div>
      )}
    </aside>
  );
};

export default CorrectionSidebar;
