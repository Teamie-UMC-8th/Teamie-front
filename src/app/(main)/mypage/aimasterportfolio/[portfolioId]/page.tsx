'use client';

import { useMasterPortfolioDetail } from '@/hooks/mutations/usePatchMasterPortfolio';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import ManualWriteSection from '@/features/aimasterportfolio/components/ManualWriteSection';
import AIGenerationSection from '@/features/aimasterportfolio/components/AIGenerationSection';
import MenuButton from '@/features/aimasterportfolio/components/MenuButton';

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

function ProjectHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-[12px] px-[30px]">
      <div className="flex items-center gap-[20px] max-lg:gap-[8px]">
        <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        <h1 className="font-[Pretendard] font-bold text-[22px] leading-[29px] tracking-[0.04em] text-[#000000] whitespace-nowrap gap-[1437px]">
          {title}
        </h1>
        <MenuButton />
      </div>
    </div>
  );
}

function ProjectPeriod({ startDate, endDate }: { startDate: string; endDate: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={STYLES.tag}>진행 기간</div>
      <time className={STYLES.text}>
        {startDate} ~ {endDate}
      </time>
    </div>
  );
}

function CategorySelector({ selected, onSelect }: { selected: Category; onSelect: (category: Category) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (option: Category) => {
    onSelect(option);
    setIsOpen(false);
  };
  return (
    <div className="flex items-center gap-[28px]">
      <div className={STYLES.tag}>분류</div>
      <div className="relative">
        <button
          className="flex items-center gap-[20px] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="w-[80px] h-[32px] rounded-[4px] px-[12px] py-[4px] text-black font-[Pretendard] text-[16px] leading-[24px] flex items-center justify-center whitespace-nowrap"
            style={{ backgroundColor: selected.color }}
          >
            {selected.label}
          </div>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <path d="M13.4393 1.56365L7.77721 7.56922..." fill="black" />
          </svg>
        </button>
        {isOpen && (
          <ul className="absolute top-[40px] left-0 z-10 w-[104px] h-[216px] bg-white rounded-[8px] shadow-[0_0_15px_rgba(0,0,0,0.2)] px-[12px] py-[10px] flex flex-col gap-[8px]">
            {CATEGORIES.map((option) => (
              <li
                key={option.label}
                className="w-full h-[36px] rounded-[6px] flex items-center justify-center cursor-pointer font-[Pretendard] text-[16px] text-black hover:opacity-80"
                style={{ backgroundColor: option.color }}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ContributionBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className={STYLES.tag}>기여도</div>
      <div className="flex items-center gap-[28px]">
        <div className="w-[299px] h-[20px] bg-[#FFFFFF] border border-[#BBBBBB] rounded-[3px] overflow-hidden">
          <div className="h-full bg-[#81D7D4] transition-all duration-300" style={{ width: `${percentage}%` }} />
        </div>
        <span className="w-[42px] h-[28px] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-[28px] tracking-[0.04em] text-center">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

function GenerationMethodSelector({ method, onMethodChange }: { method: GenerationMethod; onMethodChange: (method: GenerationMethod) => void; }) {
  const methods = [
    { id: 'ai' as const, label: 'AI 생성', hasIcon: true },
    { id: 'manual' as const, label: '직접 작성', hasIcon: false },
  ];
  return (
    <div className="flex items-center gap-0 bg-white p-[4px] rounded-[8px] border border-[#e7e7e7]">
      {methods.map(({ id, label, hasIcon }) => {
        const isSelected = method === id;
        return (
          <button
            key={id}
            onClick={() => onMethodChange(id)}
            className={`${STYLES.methodButton} ${isSelected ? 'bg-[#81D7D4] text-white font-bold cursor-default' : 'bg-[#ffffff] text-[#BBBBBB] font-normal hover:font-bold cursor-pointer'}`}
          >
            {hasIcon && (<img src="/icons/coin.svg" alt="AI 아이콘" className="w-[24px] h-[24px] object-contain" />)}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ProjectInfoSection({ startDate, endDate, category, onCategoryChange, contribution }: { startDate: string; endDate: string; category: Category; onCategoryChange: (category: Category) => void; contribution: number; }) {
  return (
    <section className="flex items-center pb-[60px] max-lg:flex-col max-lg:items-start">
      <div className="flex flex-nowrap gap-[200px] max-lg:gap-[100px]">
        <ProjectPeriod startDate={startDate} endDate={endDate} />
        <CategorySelector selected={category} onSelect={onCategoryChange} />
      </div>
      <div className="flex flex-wrap max-lg:mt-[60px] lg:ml-[200px]">
        <ContributionBar percentage={contribution} />
      </div>
    </section>
  );
}

function MasterPortfolioSection({ generationMethod, onMethodChange }: { generationMethod: GenerationMethod; onMethodChange: (method: GenerationMethod) => void; }) {
  return (
    <section className="flex items-center justify-between w-[1460px] max-lg:w-[908px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[8px] mr-[12px] ml-[12px]">
      <h2 className="text-[20px] leading-[28px] font-semibold text-[#000000] font-[Pretendard]">
        마스터 포트폴리오
      </h2>
      <GenerationMethodSelector method={generationMethod} onMethodChange={onMethodChange} />
    </section>
  );
}

export default function MasterPortfolioDetail() {
  const searchParams = useSearchParams();
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('ai');
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const projectId = Number(searchParams.get('projectId'));
  const { data, isLoading, error } = useMasterPortfolioDetail(projectId);

  if (isLoading) return <div>포트폴리오 상세 정보를 불러오는 중...</div>;
  if (error) return <div>포트폴리오 상세 정보를 불러오는데 실패했습니다.</div>;
  if (!data) return <div>포트폴리오 정보를 찾을 수 없습니다.</div>;

  const projectData = {
    title: '프로젝트 A',
    startDate: '2025.04.02',
    endDate: '2025.06.20',
    contribution: 74,
  };

  return (
    <main className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      <ProjectHeader title={projectData.title} />
      <hr className="w-[1600px] max-lg:w-[976px] h-0 border-t-[2px] border-[#E7E7E7] " />
      <div className="flex flex-col gap-4 pr-[30px] pl-[30px] pt-[40px] pb-[12px]">
        <ProjectInfoSection
          startDate={projectData.startDate}
          endDate={projectData.endDate}
          category={selectedCategory}
          onCategoryChange={setSelectedCategory}
          contribution={projectData.contribution}
        />
        <div className="flex flex-col">
          <MasterPortfolioSection
            generationMethod={generationMethod}
            onMethodChange={setGenerationMethod}
          />
          {generationMethod === 'manual' && <ManualWriteSection />}
          {generationMethod === 'ai' && <AIGenerationSection />}
        </div>
      </div>
    </main>
  );
}
