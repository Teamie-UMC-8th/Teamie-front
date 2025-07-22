'use client';

import BackButton from '@/components/BackButton';
import React from 'react';

const CorrectionSidebar: React.FC = () => {
  return (
    <aside
      className="fixed top-[0px] left-0 bg-white w-[281px] h-screen"
      style={{ boxShadow: '4px 0px 3px 0px #0000000D' }}
    >
      <div className="flex items-center ml-[162px] mt-[80px]">
        <BackButton />
        <p className="text-[18px]">돌아가기</p>
      </div>
      <div className="mt-[92px] ml-[40px]">
        <button className="cursor-pointer">
          <img src="/icons/EnterAnalyze.svg" alt="기업 정보 분석" />
        </button>
        <img src="/icons/ShortVLine.svg" alt="구분선" className="ml-[16px] mb-[8px] mt-[2px]" />
        <button className="cursor-pointer">
          <img src="/icons/ProjectSelectOff.svg" alt="프로젝트 선택" />
        </button>
      </div>

      <div className="mt-[92px] ml-[40px]">
        <button>
          <img src="/icons/EnterAnalyzeOff.svg" alt="기업 정보 분석" />
        </button>
        <img src="/icons/ShortVLine.svg" alt="구분선" className="ml-[16px] mb-[8px] mt-[2px]" />
        <button className="cursor-pointer">
          <img src="/icons/ProjectSelect.svg" alt="프로젝트 선택" />
        </button>
      </div>
    </aside>
  );
};

export default CorrectionSidebar;
