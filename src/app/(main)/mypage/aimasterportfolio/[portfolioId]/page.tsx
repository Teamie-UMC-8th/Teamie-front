'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMasterPortfolioDetail } from '@/hooks/queries/useGetMasterPortfolio';
import { useUpdateContribution } from '@/hooks/mutations/useUpdateContribution';
import ManualWriteSection from '@/features/aimasterportfolio/components/ManualWriteSection';
import AIGenerationSection from '@/features/aimasterportfolio/components/AIGenerationSection';
import MenuButton from '@/features/aimasterportfolio/components/MenuButton';
import BackButton from '@/components/BackButton';
import { CATEGORY_MAP, CATEGORY_LIST, CategoryKey } from '@/constants/category';
import ContributionSlider from '@/components/ContributionSlider';

const STYLES = {
  tag: 'w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap',
  text: 'font-[Pretendard] font-normal text-[20px] leading-[30px] text-[#000000] whitespace-nowrap',
  methodButton:
    'px-[12px] py-[4px] rounded-[4px] flex items-center justify-center gap-[8px] font-[Pretendard] text-[18px] leading-[26px] whitespace-nowrap transition-all',
} as const;

type GenerationMethod = 'ai' | 'manual';

function ProjectHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-[12px] px-[30px]">
      <div className="flex items-center gap-[20px] max-lg:gap-[8px]">
        <BackButton />
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

function CategorySelector({
  selected,
  onSelect,
}: {
  selected: CategoryKey;
  onSelect: (category: CategoryKey) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (value: CategoryKey) => {
    onSelect(value);
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
            style={{ backgroundColor: CATEGORY_MAP[selected].color }}
          >
            {CATEGORY_MAP[selected].label}
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
          <ul className="absolute top-[40px] left-0 z-10 w-[104px] bg-white rounded-[8px] shadow-[0_0_15px_rgba(0,0,0,0.2)] px-[12px] py-[10px] flex flex-col gap-[8px]">
            {CATEGORY_LIST.map((option) => (
              <li
                key={option.value}
                className="w-full h-[36px] rounded-[6px] flex items-center justify-center cursor-pointer font-[Pretendard] text-[16px] text-black hover:opacity-80"
                style={{ backgroundColor: option.color }}
                onClick={() => handleSelect(option.value)}
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
    <div className="flex items-center gap-0 bg-white p-[4px] rounded-[8px] border border-[#e7e7e7]">
      {methods.map(({ id, label, hasIcon }) => {
        const isSelected = method === id;
        return (
          <button
            key={id}
            onClick={() => onMethodChange(id)}
            className={`${STYLES.methodButton} ${isSelected ? 'bg-[#81D7D4] text-white font-bold cursor-default' : 'bg-[#ffffff] text-[#BBBBBB] font-normal hover:font-bold cursor-pointer'}`}
          >
            {hasIcon && (
              <img
                src="/icons/coin.svg"
                alt="AI 아이콘"
                className="w-[24px] h-[24px] object-contain"
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function MasterPortfolioDetail() {
  const params = useParams();
  const portfolioId = Number(params.portfolioId);
  const { data, isLoading, error } = useMasterPortfolioDetail(portfolioId);
  const updateContribution = useUpdateContribution();
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('ai');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('ACTIVITY');
  const [contribution, setContribution] = useState(50);

  const handleContributionChange = (newContribution: number) => {
    setContribution(newContribution);
    updateContribution.mutate({
      portfolioId,
      contributionRate: newContribution,
    });
  };

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
      <hr className="w-[1600px] max-lg:w-[976px] h-0 border-t-[2px] border-[#E7E7E7]" />
      <div className="flex flex-col gap-4 pr-[30px] pl-[30px] pt-[40px] pb-[12px]">
        <section className="flex items-center pb-[60px] max-lg:flex-col max-lg:items-start">
          <div className="flex flex-nowrap gap-[200px] max-lg:gap-[100px]">
            <ProjectPeriod startDate={projectData.startDate} endDate={projectData.endDate} />
            <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
          <div className="flex flex-wrap max-lg:mt-[60px] lg:ml-[200px]">
            <ContributionSlider value={contribution} onChange={handleContributionChange} />
          </div>
        </section>

        <section className="flex flex-col">
          <section className="flex items-center justify-between w-[1460px] max-lg:w-[908px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[8px] mr-[12px] ml-[12px]">
            <h2 className="text-[20px] leading-[28px] font-semibold text-[#000000] font-[Pretendard]">
              마스터 포트폴리오
            </h2>
            <GenerationMethodSelector
              method={generationMethod}
              onMethodChange={setGenerationMethod}
            />
          </section>
          {generationMethod === 'manual' && <ManualWriteSection />}
          {generationMethod === 'ai' && <AIGenerationSection contribution={contribution} />}
        </section>
      </div>
    </main>
  );
}
