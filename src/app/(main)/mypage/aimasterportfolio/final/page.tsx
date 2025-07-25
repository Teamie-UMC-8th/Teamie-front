'use client';

import Image from 'next/image';
import { useState } from 'react';

import ManualWriteSection from '@/features/aimasterportfolio/components/ManualWriteSection';
import AIGenerationSetion from '@/features/aimasterportfolio/components/AIGenerationSection';

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
    <header className="flex items-center gap-4">
      <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
      <h1 className="font-[Pretendard] font-bold text-[22px] leading-[29px] tracking-[0.04em] text-[#000000] whitespace-nowrap">
        {title}
      </h1>
    </header>
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

function CategorySelector({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (category: Category) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Category) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className={STYLES.tag}>분류</div>

      <div className="relative">
        <button
          className="flex items-center gap-[20px] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div
            className="w-[80px] h-[32px] rounded-[4px] px-[12px] py-[4px] text-black font-[Pretendard] text-[16px] leading-[26px] flex items-center justify-center whitespace-nowrap"
            style={{ backgroundColor: selected.color }}
          >
            {selected.label}
          </div>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M13.4393 1.56365L7.77721 7.56922C7.64608 7.70832 7.50507 7.81525 7.35419 7.89003C7.20331 7.96481 7.03763 8.00145 6.85714 7.99996C6.67666 7.99846 6.51097 7.96107 6.3601 7.88779C6.20922 7.8145 6.06821 7.70757 5.93708 7.56698L0.274961 1.5614C0.197407 1.47765 0.13184 1.38119 0.0782577 1.27201C0.0260853 1.16283 -3.03994e-07 1.04542 -3.09486e-07 0.919795C-3.20469e-07 0.668534 0.0775525 0.452419 0.23266 0.271451C0.390587 0.0904841 0.597162 -2.61028e-08 0.852384 -3.72589e-08L12.8598 -5.62119e-07C13.1164 -5.73337e-07 13.323 0.0927276 13.4795 0.278182C13.636 0.463636 13.7143 0.679003 13.7143 0.924281C13.7143 0.987096 13.6226 1.19947 13.4393 1.5614"
              fill="black"
            />
          </svg>
        </button>

        {isOpen && (
          <ul
            className="absolute top-[40px] left-0 z-10 bg-white border border-dashed border-[#B085E3] rounded-[8px] px-[12px] py-[10px] flex flex-col gap-[8px] w-[90px]"
            role="listbox"
          >
            {CATEGORIES.map((option) => (
              <li
                key={option.label}
                className="w-full h-[36px] rounded-[6px] flex items-center justify-center cursor-pointer font-[Pretendard] text-[16px] text-black hover:opacity-80"
                style={{ backgroundColor: option.color }}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={selected.label === option.label}
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
      <div className="flex items-center gap-[21px]">
        <div className="w-[299px] h-[20px] bg-[#FFFFFF] border border-[#BBBBBB] rounded-[3px] overflow-hidden">
          <div
            className="h-full bg-[#81D7D4] transition-all duration-300"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`기여도 ${percentage}%`}
          />
        </div>
        <span className="w-[42px] h-[28px] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-[28px] tracking-[0.04em] text-center">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

function GenerationMethodSelector({
  method,
  onMethodChange,
}: {
  method: GenerationMethod;
  onMethodChange: (method: GenerationMethod) => void;
}) {
  const methods = [
    { id: 'ai' as const, label: 'AI 생성', hasIcon: true },
    { id: 'manual' as const, label: '직접 작성', hasIcon: false },
  ];

  return (
    <div
      className="flex items-center gap-0 bg-white p-[4px] rounded-[8px] border border-[#e7e7e7]"
      role="radiogroup"
      aria-label="생성 방법 선택"
    >
      {methods.map(({ id, label, hasIcon }) => {
        const isSelected = method === id;
        return (
          <button
            key={id}
            onClick={() => onMethodChange(id)}
            className={`${STYLES.methodButton} ${
              isSelected
                ? 'bg-[#81D7D4] text-white font-bold cursor-default'
                : 'bg-[#ffffff] text-[#BBBBBB] font-normal hover:font-bold cursor-pointer'
            }`}
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
          >
            {hasIcon && (
              <div
                className="w-[24px] h-[24px] bg-[#D9D9D9] flex items-center justify-center"
                aria-hidden="true"
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ProjectInfoSection({
  startDate,
  endDate,
  category,
  onCategoryChange,
  contribution,
}: {
  startDate: string;
  endDate: string;
  category: Category;
  onCategoryChange: (category: Category) => void;
  contribution: number;
}) {
  return (
    <section className="flex items-center gap-4 justify-between pb-[60px]">
      <ProjectPeriod startDate={startDate} endDate={endDate} />
      <CategorySelector selected={category} onSelect={onCategoryChange} />
      <ContributionBar percentage={contribution} />
    </section>
  );
}

function MasterPortfolioSection({
  generationMethod,
  onMethodChange,
}: {
  generationMethod: GenerationMethod;
  onMethodChange: (method: GenerationMethod) => void;
}) {
  return (
    <section className="flex items-center justify-between bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[8px] mr-[12px] ml-[12px]">
      <h2 className="text-[20px] leading-[28px] font-semibold text-[#000000] font-[Pretendard]">
        마스터 포트폴리오
      </h2>
      <GenerationMethodSelector method={generationMethod} onMethodChange={onMethodChange} />
    </section>
  );
}

export default function AIMasterPortfolioPage() {
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('ai');
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);

  const projectData = {
    title: '프로젝트 A',
    startDate: '2025.04.02',
    endDate: '2025.06.20',
    contribution: 74,
  };

  return (
    <main className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      <ProjectHeader title={projectData.title} />

      <hr className="w-full h-[2px] bg-[#E7E7E7] border-0" />

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
          {generationMethod === 'ai' && (
            <div className="h-[804px] rounded-[16px] bg-[#F8F8F8] shadow-[0_0_8px_rgba(0,0,0,0.25)] p-[40px] flex flex-col items-start gap-[32px]">
              {/* 상세 정보 */}
              <div className="flex w-full">
                <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
                  상세 정보
                </div>
                <div className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black p-4" />
              </div>

              {/* 담당 업무 */}
              <div className="flex w-full">
                <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
                  담당 업무
                </div>
                <div className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black p-4" />
              </div>

              {/* 주요 성과 */}
              <div className="flex w-full">
                <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
                  주요 성과
                </div>
                <div className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black p-4" />
              </div>

              {/* 배운 점 */}
              <div className="flex w-full">
                <div className="w-full flex-[0.6] h-[25px] px-[18px] py-[6px] text-left font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap">
                  배운 점
                </div>
                <div className="w-full flex-[9.4] h-[162px] bg-[#FFFFFF] border-[1.5px] border-[#BBBBBB] rounded-[8px] font-[Pretendard] text-[18px] font-normal leading-[26px] text-black p-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
