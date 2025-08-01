'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

import ManualWriteSection from '@/features/aimasterportfolio/components/ManualWriteSection';
import MenuButton from '@/features/aimasterportfolio/components/MenuButton';
import { useMasterPortfolioDetail } from '@/hooks/queries/useMasterPortfolio';

const CATEGORIES = [
  { label: '수업', color: '#BED9FB' },
  { label: '동아리', color: '#CDE3C9' },
  { label: '대외활동', color: '#F7DFC4' },
  { label: '프로젝트', color: '#FBD5D5' },
  { label: '기타', color: '#C8C8C8' },
] as const;

const STYLES = {
  tag: 'w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap',
  text: 'font-[Pretendard] font-normal text-[20px] leading-[30px] text-[#000000] whitespace-nowrap',
  methodButton:
    'px-[12px] py-[4px] rounded-[4px] flex items-center justify-center gap-[8px] font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all',
} as const;

type Category = (typeof CATEGORIES)[number];
type GenerationMethod = 'ai' | 'manual';

export default function AIMasterPortfolioPage() {
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('ai');
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const detailRef = useRef<HTMLDivElement>(null);
  const taskRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const projectId = Number(params.projectId);
  const { data: portfolioDetail, isLoading } = useMasterPortfolioDetail(projectId);

  const projectData = {
    title: '프로젝트 A',
    startDate: '2025.04.02',
    endDate: '2025.06.20',
    contribution: 74,
  };

  useEffect(() => {
    if (portfolioDetail) {
      if (detailRef.current) detailRef.current.innerText = portfolioDetail.detailInfo;
      if (taskRef.current) taskRef.current.innerText = portfolioDetail.assignedTask;
      if (resultRef.current) resultRef.current.innerText = portfolioDetail.keyAchievement;
      if (learnRef.current) learnRef.current.innerText = portfolioDetail.insight;
    }
  }, [portfolioDetail]);

  const handleCopyAll = () => {
    const detail = detailRef.current?.innerText ?? '';
    const task = taskRef.current?.innerText ?? '';
    const result = resultRef.current?.innerText ?? '';
    const learn = learnRef.current?.innerText ?? '';
    const fullText = `상세 정보:\n${detail}\n\n담당 업무:\n${task}\n\n주요 성과:\n${result}\n\n배운 점:\n${learn}`;
    navigator.clipboard.writeText(fullText).then(() => alert('전체 내용이 복사되었습니다!'));
  };

  return (
    <main className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-[12px] px-[30px]">
        <div className="flex items-center gap-[20px] max-lg:gap-[8px]">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
          <h1 className="font-[Pretendard] font-bold text-[22px] leading-[29px] tracking-[0.04em] text-[#000000] whitespace-nowrap gap-[1437px]">
            {projectData.title}
          </h1>
          <MenuButton />
        </div>
      </div>

      <hr className="w-full h-[2px] bg-[#E7E7E7] border-0 m-0 mb-[60px]" />

      <div className="flex flex-col gap-4 pr-[30px] pl-[30px] pb-[12px]">
        <section className="flex items-center justify-between pb-[60px] max-lg:flex-col max-lg:items-start">
          <div className="flex flex-nowrap gap-[200px] max-lg:gap-[100px]">
            <div className="flex items-center gap-4">
              <div className={STYLES.tag}>진행 기간</div>
              <time className={STYLES.text}>
                {projectData.startDate} ~ {projectData.endDate}
              </time>
            </div>

            <div className="flex items-center gap-[28px]">
              <div className={STYLES.tag}>분류</div>
              <div
                className="w-[80px] h-[32px] rounded-[4px] px-[12px] py-[4px] text-black font-[Pretendard] text-[16px] leading-[24px] flex items-center justify-center whitespace-nowrap"
                style={{ backgroundColor: selectedCategory.color }}
              >
                {selectedCategory.label}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap max-lg:mt-[60px] lg:ml-[200px]">
            <div className="flex items-center gap-4">
              <div className={STYLES.tag}>기여도</div>
              <div className="flex items-center gap-[21px]">
                <div className="w-[299px] h-[20px] bg-[#FFFFFF] border border-[#BBBBBB] rounded-[3px] overflow-hidden">
                  <div
                    className="h-full bg-[#81D7D4] transition-all duration-300"
                    style={{ width: `${projectData.contribution}%` }}
                  />
                </div>
                <span className="w-[42px] h-[28px] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-[28px] tracking-[0.04em] text-center">
                  {projectData.contribution}%
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between w-[1460px] max-lg:w-[908px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[8px] mr-[12px] ml-[12px]">
          <h2 className="text-[20px] leading-[28px] font-semibold text-[#000000] font-[Pretendard]">
            마스터 포트폴리오
          </h2>
          <div className="flex items-center gap-0 bg-white p-[4px] rounded-[8px] border border-[#e7e7e7]">
            <button
              className={`${STYLES.methodButton} ${generationMethod === 'ai' ? 'bg-[#81D7D4] text-white font-bold cursor-default' : 'bg-[#ffffff] text-[#BBBBBB] font-normal hover:font-bold cursor-pointer'}`}
              onClick={() => setGenerationMethod('ai')}
            >
              <img src="/icons/coin.svg" alt="AI" className="w-[24px] h-[24px]" />
              AI 생성
            </button>
            <button
              className={`${STYLES.methodButton} ${generationMethod === 'manual' ? 'bg-[#81D7D4] text-white font-bold cursor-default' : 'bg-[#ffffff] text-[#BBBBBB] font-normal hover:font-bold cursor-pointer'}`}
              onClick={() => setGenerationMethod('manual')}
            >
              직접 작성
            </button>
          </div>
        </section>

        {generationMethod === 'manual' && <ManualWriteSection />}
        {generationMethod === 'ai' && (
          <div className="w-[1492px] max-lg:w-[928px] h-auto rounded-[16px] bg-[#F8F8F8] shadow-[0_0_8px_rgba(0,0,0,0.25)] p-[40px] max-lg:px-[28px] py-[40px] flex flex-col gap-[28px] max-lg:gap-[53px]">
            {/* 상세 정보 */}
            <div className="flex w-full max-lg:flex-col max-lg:gap-[8px] relative">
              <div className="w-full lg:flex-[0.6] text-[18px] font-semibold text-[#000000] whitespace-nowrap">
                상세 정보
              </div>
              <div
                ref={detailRef}
                className="w-full lg:flex-[9.4] h-[162px] min-h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 overflow-y-auto"
              />
              <button
                onClick={handleCopyAll}
                className="absolute top-[8px] right-[8px] justify-end max-lg:hidden"
              >
                <Image src="/icons/AI-copy.svg" alt="복사" width={36} height={36} />
              </button>
            </div>

            {/* 담당 업무 */}
            <div className="flex w-full max-lg:flex-col max-lg:gap-[8px]">
              <div className="w-full lg:flex-[0.6] text-[18px] font-semibold text-[#000000] whitespace-nowrap">
                담당 업무
              </div>
              <div
                ref={taskRef}
                className="w-full lg:flex-[9.4] h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 overflow-y-auto"
              />
            </div>

            {/* 주요 성과 */}
            <div className="flex w-full max-lg:flex-col max-lg:gap-[8px]">
              <div className="w-full lg:flex-[0.6] text-[18px] font-semibold text-[#000000] whitespace-nowrap">
                주요 성과
              </div>
              <div
                ref={resultRef}
                className="w-full lg:flex-[9.4] h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 overflow-y-auto"
              />
            </div>

            {/* 배운 점 */}
            <div className="flex w-full max-lg:flex-col max-lg:gap-[8px]">
              <div className="w-full lg:flex-[0.6] text-[18px] font-semibold text-[#000000] whitespace-nowrap">
                배운 점
              </div>
              <div
                ref={learnRef}
                className="w-full lg:flex-[9.4] h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 overflow-y-auto"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
