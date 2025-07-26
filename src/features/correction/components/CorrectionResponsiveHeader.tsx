'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CorrectionResponsiveHeader: React.FC = () => {
  const pathname = usePathname();
  return (
    <div
      className="fixed top-[58px] left-0 w-full h-[108px] bg-white z-50"
      style={{ boxShadow: '0px 4px 3px 0px #0000000D' }}
    >
      {/* navbar 내용 */}
      <div className="flex items-center mt-[24px] ml-[24px]">
        <Link href="/mypage">
          <img src="/icons/arrow-left.svg" alt="뒤로가기" className="cursor-pointer mr-[12px]" />
        </Link>
        <p className="text-[18px]">돌아가기</p>
      </div>

      {(pathname.includes('correctionIntro') ||
        pathname.includes('analyzing') ||
        pathname.includes('analyzefin')) && (
        <div className="flex ml-[632px] mt-[10px] items-center w-[344px]">
          <img src="/icons/EnterAnalyze.svg" alt="기업 정보 분석" />
          <p className="w-[40px] h-[2px] bg-[#BBBBBB] m-[12px] min-w-[40px]" />
          <img src="/icons/ProjectSelectOff.svg" alt="프로젝트 선택" />
        </div>
      )}
      {pathname.includes('projectSelect') && (
        <div className="flex ml-[632px] mt-[10px] items-center w-[344px]">
          <img src="/icons/EnterAnalyzeOff.svg" alt="기업 정보 분석" />
          <p className="w-[40px] h-[2px] bg-[#BBBBBB] m-[12px] min-w-[40px]" />
          <img src="/icons/ProjectSelect.svg" alt="프로젝트 선택" />
        </div>
      )}
    </div>
  );
};

export default CorrectionResponsiveHeader;
