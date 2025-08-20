'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  useMasterPortfolioDetail,
  useMasterPortfolioStatus,
  useMasterPortfolioList,
} from '@/hooks/queries/useGetMasterPortfolio';
import { useUpdateContribution } from '@/hooks/mutations/useUpdateContribution';
import { usePatchMasterPortfolio } from '@/hooks/mutations/usePatchMasterPortfolio';
import { CATEGORY_MAP, CATEGORY_LIST, CategoryKey } from '@/constants/category';
import ContributionSlider from '@/components/ContributionSlider';
import { useProjectHome } from '@/hooks/mutations/useProjectHome';
import { formatDate } from '@/utils/formatDate';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import MenuButton from '@/features/aiMasterPortfolio/components/MenuButton';
import AIGenerationSection from '@/features/aiMasterPortfolio/components/AIGenerationSection';
import LoadingModal from '@/features/aiMasterPortfolio/components/MasterLoadingModal';
import Link from 'next/link';

const STYLES = {
  tag: 'w-[99px] h-[37px] bg-[#DAF3F3] rounded-[4px] px-[18px] py-[6px] flex items-center justify-center font-[Pretendard] font-semibold text-[18px] leading-[25.2px] text-[#000000] whitespace-nowrap',
  text: 'font-[Pretendard] font-normal text-[20px] leading-[30px] text-[#000000] whitespace-nowrap',
} as const;

function ProjectHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-[12px] px-[30px]">
      <div className="flex items-center gap-[20px] max-lg:gap-[8px]">
        <Link href="/myPage" className="flex items-center gap-[8px] cursor-pointer">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
          <h1 className="font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] text-[#000000] whitespace-nowrap">
            {title}
          </h1>
        </Link>
        <MenuButton />
      </div>
    </div>
  );
}

function ProjectPeriod({ startDate, endDate }: { startDate: string; endDate: string }) {
  const formatDateToYYYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <div className="flex items-center gap-[28px]">
      <div className={STYLES.tag}>진행 기간</div>
      <time className={STYLES.text}>
        {formatDateToYYYYMMDD(startDate)} ~ {formatDateToYYYYMMDD(endDate)}
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
          <Image
            src="/icons/drop-down.svg"
            alt="드롭다운"
            width={24}
            height={24}
            className={isOpen ? 'rotate-180' : ''}
          />
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });
  const {
    data: status,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useMasterPortfolioStatus(portfolioId);
  const detailRef = useRef<HTMLDivElement>(null);
  const taskRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 프로젝트 정보 가져오기
  const { data: projectHomeData, isLoading: projectLoading } = useProjectHome(data?.projectId || 0);

  // 마스터 포트폴리오 목록에서 현재 포트폴리오의 날짜 정보 가져오기
  const { data: portfolioListData } = useMasterPortfolioList();

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

  // DONE 화면용 내용 채우기
  // useEffect(() => {
  //   console.log("1", data)
  //   if (data) {
  //     if (detailRef.current) detailRef.current.innerText = data.detailInfo || '';
  //     if (taskRef.current) taskRef.current.innerText = data.assignedTask || '';
  //     if (resultRef.current) resultRef.current.innerText = data.keyAchievement || '';
  //     if (learnRef.current) learnRef.current.innerText = data.insight || '';
  //   }
  // }, [data, status?.result.status]);

  // GENERATING 상태에서 주기적으로 상태 폴링, DONE 전환 시 상세 데이터 갱신
  useEffect(() => {
    const currentStatus = status?.result.status;
    if (currentStatus === 'GENERATING') {
      const intervalId = window.setInterval(() => {
        refetchStatus();
      }, 1500);
      return () => {
        window.clearInterval(intervalId);
      };
    }

    if (currentStatus === 'DONE') {
      queryClient.invalidateQueries({ queryKey: ['master-portfolio', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['masterPortfolioGeneratedResult', portfolioId] });
    }
  }, [status?.result.status, refetchStatus, queryClient, portfolioId]);

  // 상세 페이지 진입 시 항상 최신 상태 확인
  useEffect(() => {
    refetchStatus();
  }, [refetchStatus]);

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

  const handleCopyField = (
    ref: React.RefObject<HTMLDivElement | null>,
    event: React.MouseEvent
  ) => {
    const text = ref.current?.innerText ?? '';
    navigator.clipboard.writeText(text);

    // 클릭한 버튼의 위치를 기준으로 토스트 위치 설정
    const rect = event.currentTarget.getBoundingClientRect();
    setToastPosition({
      x: rect.right + 10,
      y: rect.top + rect.height / 2 - 21,
    });
    setToastMessage('복사되었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
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
    startDate: currentPortfolio?.startDate || '날짜 정보 없음',
    endDate: currentPortfolio?.endDate || '날짜 정보 없음',
    contribution: contribution,
  };

  return (
    <main className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      <ProjectHeader title={projectData.title} />
      <hr className="w-[1600px] max-lg:w-[976px] h-0 border-t-[2px] border-[#E7E7E7]" />
      <div className="flex flex-col gap-4 pr-[30px] pl-[30px] pt-[40px] pb-[12px]">
        <section className="flex items-center pb-[60px] max-lg:flex-col max-lg:items-start">
          <div className="flex flex-nowrap gap-[205px] max-lg:gap-[100px]">
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
          {status?.result.status === 'DONE' ? (
            <div className="w-[1492px] max-lg:w-[928px] h-auto rounded-[16px] bg-[#F8F8F8] shadow-[0_0_8px_rgba(0,0,0,0.25)] p-[40px] max-lg:px-[28px] py-[40px] flex flex-col gap-[28px] max-lg:gap-[53px]">
              {/* 상세 정보 */}
              <div className="flex w-full max-lg:flex-col max-lg:gap-[8px] relative group">
                <div className="w-full lg:flex-[0.6] h-[34px] text-[18px] leading-[34px] font-semibold text-[#000000] whitespace-nowrap">
                  상세 정보
                </div>
                <div
                  ref={detailRef}
                  className="w-full lg:flex-[9.4] min-h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 whitespace-pre-wrap"
                >
                  {data.detailInfo}
                </div>
                <button
                  onClick={(event) => handleCopyField(detailRef, event)}
                  className="absolute top-[8px] right-[8px] justify-end max-lg:hidden cursor-pointer opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                >
                  <Image src="/icons/AI-copy.svg" alt="복사" width={36} height={36} />
                </button>
              </div>

              {/* 담당 업무 */}
              <div className="flex w-full max-lg:flex-col max-lg:gap-[8px] relative group">
                <div className="w-full lg:flex-[0.6] h-[34px] text-[18px] leading-[34px] font-semibold text-[#000000] whitespace-nowrap">
                  담당 업무
                </div>
                <div
                  ref={taskRef}
                  className="w-full lg:flex-[9.4] min-h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 whitespace-pre-wrap"
                >
                  {data.assignedTask}
                </div>
                <button
                  onClick={(event) => handleCopyField(taskRef, event)}
                  className="absolute top-[8px] right-[8px] justify-end max-lg:hidden cursor-pointer opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                >
                  <Image src="/icons/AI-copy.svg" alt="복사" width={36} height={36} />
                </button>
              </div>

              {/* 주요 성과 */}
              <div className="flex w-full max-lg:flex-col max-lg:gap-[8px] relative group">
                <div className="w-full lg:flex-[0.6] h-[34px] text-[18px] leading-[34px] font-semibold text-[#000000] whitespace-nowrap">
                  주요 성과
                </div>
                <div
                  ref={resultRef}
                  className="w-full lg:flex-[9.4] min-h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 whitespace-pre-wrap"
                >
                  {data.keyAchievement}
                </div>
                <button
                  onClick={(event) => handleCopyField(resultRef, event)}
                  className="absolute top-[8px] right-[8px] justify-end max-lg:hidden cursor-pointer opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                >
                  <Image src="/icons/AI-copy.svg" alt="복사" width={36} height={36} />
                </button>
              </div>

              {/* 배운 점 */}
              <div className="flex w-full max-lg:flex-col max-lg:gap-[8px] relative group">
                <div className="w-full lg:flex-[0.6] h-[34px] text-[18px] leading-[34px] font-semibold text-[#000000] whitespace-nowrap">
                  배운 점
                </div>
                <div
                  ref={learnRef}
                  className="w-full lg:flex-[9.4] min-h-[162px] bg-white border-[1.5px] border-[#BBBBBB] rounded-[8px] p-4 whitespace-pre-wrap"
                >
                  {data.insight}
                </div>
                <button
                  onClick={(event) => handleCopyField(learnRef, event)}
                  className="absolute top-[8px] right-[8px] justify-end max-lg:hidden cursor-pointer opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                >
                  <Image src="/icons/AI-copy.svg" alt="복사" width={36} height={36} />
                </button>
              </div>
            </div>
          ) : (
            <AIGenerationSection contribution={contribution} />
          )}
        </section>
      </div>

      {/* 생성 진행 중 재진입 시 마지막 단계부터 표시되는 로딩 모달 */}
      {status?.result.status === 'GENERATING' && <LoadingModal isOpen startFromLast />}

      {/* 토스트 메시지 */}
      {showToast && (
        <div
          className="fixed z-50"
          style={{
            left: `${toastPosition.x}px`,
            top: `${toastPosition.y}px`,
          }}
        >
          <div className="w-[154px] h-[42px] bg-[#F8F8F8] border-[1.5px] border-[#BBBBBB] rounded-[6px] text-[18px] text-[#505050] flex items-center justify-center whitespace-nowrap leading-[26px] text-center">
            {toastMessage}
          </div>
        </div>
      )}
    </main>
  );
}
