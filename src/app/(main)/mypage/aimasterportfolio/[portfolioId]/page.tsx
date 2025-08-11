'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useMasterPortfolioDetail,
  useMasterPortfolioStatus,
  useMasterPortfolioList,
} from '@/hooks/queries/useGetMasterPortfolio';
import { useUpdateContribution } from '@/hooks/mutations/useUpdateContribution';
import { usePatchMasterPortfolio } from '@/hooks/mutations/usePatchMasterPortfolio';
import AIGenerationSection from '@/features/aimasterportfolio/components/AIGenerationSection';
import MenuButton from '@/features/aimasterportfolio/components/MenuButton';
import BackButton from '@/components/BackButton';
import { CATEGORY_MAP, CATEGORY_LIST, CategoryKey } from '@/constants/category';
import ContributionSlider from '@/components/ContributionSlider';
import { useRouter } from 'next/navigation';
import { useProjectHome } from '@/hooks/mutations/useProjectHome';
import { formatDate } from '@/utils/formatDate';
import Image from 'next/image';

const STYLES = {
  tag: 'w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap',
  text: 'font-[Pretendard] font-normal text-[20px] leading-[30px] text-[#000000] whitespace-nowrap',
} as const;

function ProjectHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[12px] px-[30px]">
      <div className="flex items-center gap-[20px] max-lg:gap-[8px]">
        <button
          onClick={() => router.push('/mypage')}
          aria-label="뒤로가기"
          className="cursor-pointer"
        >
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] text-[#000000] whitespace-nowrap gap-[1437px]">
          {title}
        </h1>
        <MenuButton />
      </div>
    </div>
  );
}

function ProjectPeriod({ startDate, endDate }: { startDate: string; endDate: string }) {
  return (
    <div className="flex items-center gap-[28px]">
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
            style={{ backgroundColor: CATEGORY_MAP[selected]?.color ?? '#FFFFFF' }}
          >
            {CATEGORY_MAP[selected]?.label ?? '분류'}
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

export default function MasterPortfolioDetail() {
  const params = useParams();
  const portfolioId = Number(params.portfolioId);
  const { data, isLoading, error } = useMasterPortfolioDetail(portfolioId);
  const updateContribution = useUpdateContribution();
  const patchMasterPortfolio = usePatchMasterPortfolio();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('COURSE');
  const [contribution, setContribution] = useState(0); // 초기값 0으로 변경
  const { data: status, isLoading: statusLoading } = useMasterPortfolioStatus(portfolioId);
  const router = useRouter();

  // 프로젝트 정보 가져오기
  const { data: projectHomeData, isLoading: projectLoading } = useProjectHome(data?.projectId || 0);

  // 마스터 포트폴리오 목록에서 현재 포트폴리오의 날짜 정보 가져오기
  const { data: portfolioListData } = useMasterPortfolioList();

  useEffect(() => {
    if (status?.result.status === 'DONE') {
      router.push(`/mypage/aimasterportfolio/${portfolioId}/final`);
    }
  }, [status, portfolioId, router]);

  // API 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (data?.contributionRate !== undefined && data?.contributionRate !== null) {
      setContribution(data.contributionRate);
    }
    if (data?.category) {
      const key = String(data.category).toUpperCase();
      setSelectedCategory(
        (CATEGORY_MAP as Record<string, { label: string; color: string }>)[key]
          ? (key as CategoryKey)
          : 'COURSE'
      );
    }
  }, [data]);

  const handleContributionChange = (newContribution: number) => {
    setContribution(newContribution);
    updateContribution.mutate({
      portfolioId,
      contributionRate: newContribution,
    });
  };

  const handleCategoryChange = (newCategory: CategoryKey) => {
    setSelectedCategory(newCategory);
    if (data) {
      patchMasterPortfolio.mutate({
        portfolioId,
        body: {
          detailInfo: data.detailInfo || '',
          assignedTask: data.assignedTask || '',
          keyAchievement: data.keyAchievement || '',
          insight: data.insight || '',
          contributionRate: contribution,
          mainTask: data.mainTask || '',
          category: newCategory,
        },
      });
    }
  };

  if (isLoading || statusLoading || projectLoading)
    return <div>포트폴리오 상세 정보를 불러오는 중...</div>;
  if (error) return <div>포트폴리오 상세 정보를 불러오는데 실패했습니다.</div>;
  if (!data) return <div>포트폴리오 정보를 찾을 수 없습니다.</div>;

  // API 데이터에서 프로젝트 정보 추출
  const project = projectHomeData?.result?.project;
  const currentPortfolio = portfolioListData?.data?.find((p) => p.portfolioId === portfolioId);

  const projectData = {
    title: project?.name || currentPortfolio?.projectName || '프로젝트 이름 없음',
    startDate: currentPortfolio?.startDate
      ? formatDate(currentPortfolio.startDate)
      : '날짜 정보 없음',
    endDate: currentPortfolio?.endDate ? formatDate(currentPortfolio.endDate) : '날짜 정보 없음',
    contribution: contribution,
  };

  return (
    <main className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      <ProjectHeader title={projectData.title} />
      <hr className="w-[1600px] max-lg:w-[976px] h-0 border-t-[2px] border-[#E7E7E7]" />
      <div className="flex flex-col gap-4 pr-[30px] pl-[30px] pt-[40px] pb-[12px]">
        <section className="flex items-center justify-between pb-[60px] max-lg:flex-col max-lg:items-start">
          <div className="flex flex-nowrap gap-[200px] max-lg:gap-[100px]">
            <ProjectPeriod startDate={projectData.startDate} endDate={projectData.endDate} />
            <CategorySelector selected={selectedCategory} onSelect={handleCategoryChange} />
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
          </section>
          <AIGenerationSection contribution={contribution} />
        </section>
      </div>
    </main>
  );
}
