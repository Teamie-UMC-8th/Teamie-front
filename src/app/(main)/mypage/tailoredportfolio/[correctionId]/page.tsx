'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCorrectionDetail,
  fetchGeneratedCorrection,
  fetchRagData,
  fetchCompanyInsight,
  patchCorrectionTitle,
  fetchGeneratedCorrectionByProject,
} from '@/services/correction/correction';
import type { FirstCorrectionBlock, GeneratedLineItem } from '@/types/api/correction';
import DeleteButton from '@/components/DeleteButton';
import ReductionToggle from '@/features/correction/components/ReductionToggle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConcretizationToggle from '@/features/correction/components/ConcretizationToggle';
import Image from 'next/image';
import CompanyInsightProcessModal from '@/features/correction/components/CompanyInsightProcessModal';
import { useMasterPortfolioList } from '@/hooks/queries/useGetMasterPortfolio';
import type { MasterPortfolio } from '@/types/api/masterportfolio';
import { CATEGORY_MAP } from '@/constants/category';
import { formatDateRange } from '@/utils/formatDate';

function TailoredPortfolioContent() {
  const params = useParams();
  const correctionId = Number(params.correctionId);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  // 섹션별 토글 상태 (상세, 담당, 성과, 배움)
  const [detailReduceOn, setDetailReduceOn] = useState(false);
  const [detailConcreteOn, setDetailConcreteOn] = useState(false);
  const [tasksReduceOn, setTasksReduceOn] = useState(false);
  const [tasksConcreteOn, setTasksConcreteOn] = useState(false);
  const [achReduceOn, setAchReduceOn] = useState(false);
  const [achConcreteOn, setAchConcreteOn] = useState(false);
  const [insReduceOn, setInsReduceOn] = useState(false);
  const [insConcreteOn, setInsConcreteOn] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [titleInput, setTitleInput] = useState<string>('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [cachedProjects, setCachedProjects] = useState<Array<{ id: number; name: string }>>([]);

  // 마스터포트폴리오 목록(진행기간/분류/기여도 반영용)
  const { data: masterListData } = useMasterPortfolioList();

  const { data, isLoading, error } = useQuery({
    queryKey: ['correction-detail', correctionId],
    queryFn: () => fetchCorrectionDetail(correctionId),
    enabled: !!correctionId,
  });

  const { data: generated, refetch: refetchGenerated } = useQuery({
    queryKey: ['generated-correction', correctionId],
    queryFn: () => fetchGeneratedCorrection(correctionId),
    enabled: !!correctionId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
  });

  const { data: rag } = useQuery({
    queryKey: ['generated-rag', correctionId],
    queryFn: () => fetchRagData(correctionId),
    enabled: !!correctionId,
    staleTime: 60_000,
  });

  const { data: companyInsight } = useQuery({
    queryKey: ['company-insight', correctionId],
    queryFn: () => fetchCompanyInsight(correctionId),
    enabled: !!correctionId,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (correctionId) {
      refetchGenerated();
    }
  }, [correctionId, refetchGenerated]);

  // 선택된 탭에 해당하는 프로젝트 ID 계산 (서버 응답 or 세션 프리패치)
  const selectedProjectId: number | undefined = (() => {
    const list = (
      generated?.projects && generated.projects.length > 0
        ? (generated.projects as Array<{ id: number; name: string }>)
        : cachedProjects
    ) as Array<{ id: number; name: string }>;
    const proj = Array.isArray(list) ? list[selectedProjectIndex] : undefined;
    const id = Number(proj?.id);
    return Number.isFinite(id) ? id : undefined;
  })();

  // 선택된 프로젝트의 마스터포트폴리오 메타데이터
  const selectedMaster: MasterPortfolio | undefined = (() => {
    const list: MasterPortfolio[] = ((masterListData?.data || []) as MasterPortfolio[]) || [];
    // 우선 projectId로 매칭, 없으면 이름으로 매칭
    const byId = list.find((m) => Number(m.projectId as unknown as number) === selectedProjectId);
    if (byId) return byId;
    const selectedName = (
      (generated?.projects && generated.projects[selectedProjectIndex]?.name) ||
      cachedProjects[selectedProjectIndex]?.name ||
      ''
    ).trim();
    if (!selectedName) return undefined;
    return list.find((m) => (m.projectName || '').trim() === selectedName);
  })();

  const durationLabel = selectedMaster
    ? formatDateRange(String(selectedMaster.startDate || ''), String(selectedMaster.endDate || ''))
    : '';
  const categoryLabel = selectedMaster
    ? CATEGORY_MAP[(selectedMaster.category as keyof typeof CATEGORY_MAP) || 'OTHER']?.label ||
      selectedMaster.category
    : '';
  const contributionRateLabel = selectedMaster
    ? `${Number(selectedMaster.contributionRate || 0)}%`
    : '';

  // 선택된 프로젝트의 생성 결과 조회
  const { data: selectedCorrection } = useQuery({
    queryKey: ['generated-correction-by-project', correctionId, selectedProjectId],
    queryFn: () => fetchGeneratedCorrectionByProject(correctionId, selectedProjectId!),
    enabled: !!correctionId && typeof selectedProjectId === 'number',
    staleTime: 0,
  });

  // 표시용 현재 프로젝트 결과 (탭 변경 시 갱신)
  const currentCorrection: FirstCorrectionBlock | undefined =
    selectedCorrection || generated?.firstCorrection;

  // 세션 프리패치에 저장된 생성 결과가 있다면 우선 탭 이름에 사용 (네트워크 응답 전 즉시 표시)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`generatedCorrection:${correctionId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { projects?: Array<{ id: number; name: string }> } | null;
      if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        setCachedProjects(parsed.projects.map((p) => ({ id: Number(p.id), name: String(p.name) })));
      }
    } catch {}
  }, [correctionId]);

  // 동기화: 서버에서 받은 제목을 에디터 값에 반영 (최초 로드 시 1회 설정)
  useEffect(() => {
    if (!data?.title) return;
    if (titleInput === '') {
      setTitleInput(data.title);
    }
  }, [data, titleInput]);

  if (isLoading) return <div>AI 첨삭 정보를 불러오는 중...</div>;
  if (error) return <div>AI 첨삭 정보를 불러오는데 실패했습니다.</div>;
  if (!data) return <div>AI 첨삭 정보를 찾을 수 없습니다.</div>;

  const saveTitleIfChanged = async () => {
    const newTitle = (titleRef.current?.textContent || titleInput || '').trim();
    const currentTitle = (data?.title || '').trim();
    if (!newTitle || newTitle === currentTitle) return;
    try {
      await patchCorrectionTitle(correctionId, { title: newTitle });
      queryClient.setQueryData(['correction-detail', correctionId], (prev: unknown) => {
        if (prev && typeof prev === 'object') {
          return { ...(prev as Record<string, unknown>), title: newTitle };
        }
        return prev;
      });
    } catch {
      // 실패 시에는 일단 롤백: 화면 텍스트를 기존 제목으로 복원
      if (titleRef.current) titleRef.current.textContent = currentTitle;
      setTitleInput(currentTitle);
    }
  };

  // 기업명 보강: 상세 데이터 → 제목 → 세션 프리패치 순으로 확보
  const companyNameForModal: string = (() => {
    // analyzing과 동일한 우선순위: URL 쿼리 → 세션 캐시 → 상세 응답 → 프리패치 → 백업 캐시
    const fromQuery = (
      searchParams.get('submissionTarget') ||
      searchParams.get('companyName') ||
      ''
    ).trim();
    let name = fromQuery;
    if (!name) {
      try {
        const cachedNameById = sessionStorage.getItem(`companyName:${correctionId}`);
        if (cachedNameById && cachedNameById.trim()) name = cachedNameById;
      } catch {}
    }
    if (!name) {
      name = (data?.submissionTarget || data?.title || '') as string;
    }
    try {
      const backup = sessionStorage.getItem('lastCorrectionCompanyName');
      if (!name && backup) name = backup;
    } catch {}
    if (!name) {
      try {
        const cached = sessionStorage.getItem(`analyzingPrefetch:${correctionId}`);
        if (cached) {
          const parsed = JSON.parse(cached) as { detail?: { title?: string } } | undefined;
          name = (parsed?.detail?.title || '') as string;
        }
      } catch {}
    }
    return name;
  })();

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Link href="/mypage">
            <Image
              src="/icons/arrow-left.svg"
              alt="뒤로가기"
              className="mt-[29px]"
              width={0}
              height={0}
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          <h1
            className="text-[24px] font-semibold mt-[28px] ml-[20px] focus:outline-none outline-none focus:ring-0 focus:shadow-none
          max-lg:ml-[8px]"
            contentEditable
            suppressContentEditableWarning
            ref={titleRef}
            onInput={(e) => setTitleInput(e.currentTarget.textContent || '')}
            onBlur={saveTitleIfChanged}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.currentTarget as HTMLElement).blur();
              }
            }}
          >
            {data.title || '새로운 첨삭'}
          </h1>
        </div>
        <DeleteButton
          onDelete={async () => {
            try {
              const { deleteCorrection } = await import('@/services/correction/correction');
              await deleteCorrection(correctionId);
            } finally {
              // 목록/상세 관련 캐시 무효화 후 마이페이지로 이동
              queryClient.invalidateQueries({ queryKey: ['correction-detail', correctionId] });
              queryClient.invalidateQueries({ queryKey: ['generated-correction', correctionId] });
              queryClient.invalidateQueries({ queryKey: ['generated-rag', correctionId] });
              queryClient.invalidateQueries({ queryKey: ['company-insight', correctionId] });
              queryClient.invalidateQueries({ queryKey: ['correction-list'] });
              router.push('/myPage');
            }
          }}
          modalTitle="이 AI 첨삭 내용을 정말 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
        />
      </div>

      {/* Divider line */}
      <div
        className="mt-[10px] ml-[40px] border-[#E7E7E7] border-[1px]
      max-lg:ml-[0px]"
      />

      <div>
        <div
          className="flex flex-row mt-[60px] ml-[80px] items-center w-[1500px]
        max-lg:ml-[24px] max-lg:flex-col max-lg:items-start"
        >
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] font-semibold">
              생성 일자
            </div>
            <p className="text-black text-[20px] grid place-items-center ml-[28px]">
              {new Date(data.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>

          <div
            className="flex items-center ml-[312px]
          max-lg:ml-[0px] max-lg:mt-[40px]"
          >
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] font-semibold">
              기업명
            </div>
            <p className="ml-[28px] text-[20px] mr-[342px]">{data.submissionTarget}</p>

            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] font-semibold">
              직무명
            </div>
            <p className="text-[20px] ml-[28px]">{data.jobTitle}</p>
          </div>
        </div>

        <div
          className="ml-[80px] mt-[60px]
        max-lg:ml-[24px]"
        >
          <div className="flex items-center gap-[12px]">
            <div className="text-[22px] font-semibold">기업 분석 정보</div>
            <Image
              src="/icons/InformationIcon.svg"
              alt="기업 분석 정보"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => setShowInsightModal(true)}
            />
          </div>
          <textarea
            className=" mt-[16px] border-[2px] border-[#BBBBBB] w-[1520px] h-[338px] rounded-[8px] px-[20px] py-[16px] text-[18px] resize-none overflow-auto
          max-lg:w-[928px] max-lg:h-[338px]"
            value={
              (companyInsight?.companyInsight || '').trim() ||
              currentCorrection?.correctionResult?.insights?.field_summary ||
              ''
            }
            readOnly
          />
        </div>

        <div
          className="ml-[80px] mt-[80px]
        max-lg:ml-[24px] max-lg:mt-[40px]"
        >
          <div className="text-[22px] font-semibold">JD (Job Description)</div>
          <textarea
            className=" mt-[16px] border-[2px] border-[#BBBBBB] w-[1520px] h-[338px] rounded-[8px] px-[20px] py-[16px] text-[18px] resize-none overflow-auto
          max-lg:w-[928px] max-lg:h-[338px]"
            defaultValue={data?.jd ?? data?.content ?? ''}
            readOnly
          />
        </div>
      </div>

      <div
        className="flex mt-[80px] ml-[96px]
      max-lg:ml-[40px]"
      >
        {(generated?.projects && generated.projects.length > 0
          ? (generated.projects as Array<{ id: number; name: string }>)
          : cachedProjects
        ).map((proj, idx) => {
          const isSelected = selectedProjectIndex === idx;
          const label = proj?.name || `프로젝트 ${idx + 1}`;
          return (
            <div
              key={proj?.id ?? label}
              onClick={() => setSelectedProjectIndex(idx)}
              className={`${
                isSelected ? 'bg-[#E9F8F8]' : 'bg-[#F8F8F8]'
              } relative px-[40px] py-[16px] rounded-tl-[8px] rounded-tr-[8px] cursor-pointer select-none`}
            >
              <p
                className={`font-bold text-[18px] ${isSelected ? 'text-black' : 'text-[#8A8A8A]'}`}
              >
                {label}
              </p>
              {isSelected && (
                <div className="absolute left-0 bottom-0 w-full h-[4px] bg-[#81D7D4]" />
              )}
            </div>
          );
        })}
      </div>

      {/* 프로젝트 별 첨삭 내용*/}
      <div
        className="w-[1520px] h-auto bg-[#F8F8F8] ml-[80px] rounded-[16px] relative z-10 p-[60px]
        max-lg:w-[928px] max-lg:h-[4325px] max-lg:p-[36px] max-lg:ml-[24px]"
        style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
      >
        <div className="flex flex-row items-center w-[1500px]">
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] font-semibold text-[18px]">
            진행 기간
          </div>
          <p className="text-black text-[20px] grid place-items-center ml-[28px]">
            {durationLabel}
          </p>
          <div
            className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[200px] mr-[8px] font-semibold text-[18px]
          max-lg:ml-[229px]"
          >
            분류
          </div>
          <div className="ml-[28px] w-[160px]">
            <span
              className="inline-block text-[18px] px-[10px] py-[4px] rounded-[4px]"
              style={{
                backgroundColor:
                  CATEGORY_MAP[(selectedMaster?.category as keyof typeof CATEGORY_MAP) || 'OTHER']
                    ?.color || '#C8C8C8',
              }}
            >
              {categoryLabel}
            </span>
          </div>
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[200px] font-semibold text-[18px]">
            기여도
          </div>
          <div className="ml-[28px] flex items-center">
            <div className="bg-white border border-[#E7E7E7] rounded-[2px] w-[286px] h-[10px] max-lg:w-[248px]">
              <div
                className="bg-[#81D7D4] rounded-[2px] h-[8px]"
                style={{ width: String(selectedMaster?.contributionRate || 0) + '%' }}
              />
            </div>
            <span className="text-[20px] ml-[12px]">{contributionRateLabel}</span>
          </div>
        </div>
        <div
          className="mt-[80px]
        max-lg:mt-[48px]"
        >
          <div className="text-[22px] font-semibold">AI 첨삭 내용</div>
          <div className="mt-[10px] border-[#E7E7E7] border-[1px]" />
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">상세 정보</div>
          <div
            className="w-[1400px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:flex-col"
          >
            <div className="w-[620px] text-[18px] mt-[8px] max-lg:text-[16px] max-lg:w-[784px]">
              {(
                currentCorrection?.correctionResult?.detailInfo?.lines ||
                ([] as GeneratedLineItem[])
              ).map((ln: GeneratedLineItem, idx) => {
                const text = String(ln?.original_content || '').trim();
                if (!text) return null;
                const isReduction = detailReduceOn && Number(ln?.type) === 1;
                const isConcretize = detailConcreteOn && Number(ln?.type) === 2;
                const style = isReduction
                  ? {
                      backgroundColor: '#FDF5F5',
                      borderLeft: '4px solid #EF7C7C',
                      borderRadius: '4px',
                    }
                  : isConcretize
                    ? {
                        backgroundColor: '#F5FBF5',
                        borderLeft: '4px solid #97D099',
                        borderRadius: '4px',
                      }
                    : { borderLeft: '4px solid transparent', borderRadius: '4px' };
                return (
                  <p key={`detail-${idx}`} style={style}>
                    {text}
                  </p>
                );
              })}
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] mt-[8px]">
              <div
                className="w-[620px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[12px]
              max-lg:w-[784px]"
              >
                <div className="text-[16px] font-semibold mb-[6px]">항목 총평</div>
                <div className="text-[18px] leading-[26px] whitespace-pre-line">
                  {currentCorrection?.correctionResult?.detailInfo?.field_summary || ''}
                </div>
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle
                  isOn={detailReduceOn}
                  onRToggle={(v) => {
                    setDetailReduceOn(v);
                    if (v) setDetailConcreteOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              {/* 축소 대상 라인 목록 (type === 1) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.detailInfo?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 1)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`detail-reduce-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#EF7C7C] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 총평 내용은 상단 박스 안에 표시됨 */}

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle
                  isOn={detailConcreteOn}
                  onCToggle={(v) => {
                    setDetailConcreteOn(v);
                    if (v) setDetailReduceOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              {/* 구체화 대상 라인 목록 (type === 2) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.detailInfo?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 2)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`detail-concrete-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#97D099] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 가이드 문구 제거 */}
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">담당 업무</div>
          <div
            className="w-[1400px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:flex-col"
          >
            <div className="w-[620px] text-[18px] mt-[8px] max-lg:text-[16px] max-lg:w-[784px]">
              {(
                currentCorrection?.correctionResult?.assignedTasks?.lines ||
                ([] as GeneratedLineItem[])
              ).map((ln: GeneratedLineItem, idx) => {
                const text = String(ln?.original_content || '').trim();
                if (!text) return null;
                const isReduction = tasksReduceOn && Number(ln?.type) === 1;
                const isConcretize = tasksConcreteOn && Number(ln?.type) === 2;
                const style = isReduction
                  ? {
                      backgroundColor: '#FDF5F5',
                      borderLeft: '4px solid #EF7C7C',
                      borderRadius: '4px',
                    }
                  : isConcretize
                    ? {
                        backgroundColor: '#F5FBF5',
                        borderLeft: '4px solid #97D099',
                        borderRadius: '4px',
                      }
                    : { borderLeft: '4px solid transparent', borderRadius: '4px' };
                return (
                  <p key={`tasks-${idx}`} style={style}>
                    {text}
                  </p>
                );
              })}
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] ml-[40px] mr-[40px] block max-lg:hidden" />

            <div className="w-[620px] mt-[8px]">
              <div
                className="w-[620px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[12px]
              max-lg:w-[784px]"
              >
                <div className="text-[16px] font-semibold mb-[6px]">항목 총평</div>
                <div className="text-[18px] leading-[22px] whitespace-pre-line">
                  {currentCorrection?.correctionResult?.assignedTasks?.field_summary || ''}
                </div>
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle
                  isOn={tasksReduceOn}
                  onRToggle={(v) => {
                    setTasksReduceOn(v);
                    if (v) setTasksConcreteOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              {/* 축소 대상 라인 목록 (type === 1) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.assignedTasks?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 1)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`tasks-reduce-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#EF7C7C] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 총평 내용은 상단 박스 안에 표시됨 */}

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle
                  isOn={tasksConcreteOn}
                  onCToggle={(v) => {
                    setTasksConcreteOn(v);
                    if (v) setTasksReduceOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              {/* 구체화 대상 라인 목록 (type === 2) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.assignedTasks?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 2)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`tasks-concrete-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#97D099] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 가이드 문구 제거 */}
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">주요 성과</div>
          <div
            className="w-[1400px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:flex-col"
          >
            <div className="w-[620px] text-[18px] mt-[8px] max-lg:text-[16px] max-lg:w-[784px]">
              {(
                currentCorrection?.correctionResult?.keyAchievements?.lines ||
                ([] as GeneratedLineItem[])
              ).map((ln: GeneratedLineItem, idx) => {
                const text = String(ln?.original_content || '').trim();
                if (!text) return null;
                const isReduction = achReduceOn && Number(ln?.type) === 1;
                const isConcretize = achConcreteOn && Number(ln?.type) === 2;
                const style = isReduction
                  ? {
                      backgroundColor: '#FDF5F5',
                      borderLeft: '4px solid #EF7C7C',
                      borderRadius: '4px',
                    }
                  : isConcretize
                    ? {
                        backgroundColor: '#F5FBF5',
                        borderLeft: '4px solid #97D099',
                        borderRadius: '4px',
                      }
                    : { borderLeft: '4px solid transparent', borderRadius: '4px' };
                return (
                  <p key={`ach-${idx}`} style={style}>
                    - {text}
                  </p>
                );
              })}
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] ml-[40px] mr-[40px] block max-lg:hidden" />

            <div className="w-[620px] mt-[8px]">
              <div
                className="w-[620px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[12px]
              max-lg:w-[784px]"
              >
                <div className="text-[16px] font-semibold mb-[6px]">항목 총평</div>
                <div className="text-[18px] leading-[26px] whitespace-pre-line">
                  {currentCorrection?.correctionResult?.keyAchievements?.field_summary || ''}
                </div>
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle
                  isOn={achReduceOn}
                  onRToggle={(v) => {
                    setAchReduceOn(v);
                    if (v) setAchConcreteOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              {/* 축소 대상 라인 목록 (type === 1) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.keyAchievements?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 1)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`ach-reduce-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#EF7C7C] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 총평 내용은 상단 박스 안에 표시됨 */}

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle
                  isOn={achConcreteOn}
                  onCToggle={(v) => {
                    setAchConcreteOn(v);
                    if (v) setAchReduceOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              {/* 구체화 대상 라인 목록 (type === 2) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.keyAchievements?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 2)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`ach-concrete-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#97D099] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 가이드 문구 제거 */}
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">배운 점</div>
          <div
            className="w-[1400px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:flex-col"
          >
            <div className="w-[620px] text-[18px] mt-[8px] max-lg:text-[16px] max-lg:w-[784px]">
              {(
                currentCorrection?.correctionResult?.insights?.lines || ([] as GeneratedLineItem[])
              ).map((ln: GeneratedLineItem, idx) => {
                const text = String(ln?.original_content || '').trim();
                if (!text) return null;
                const isReduction = insReduceOn && Number(ln?.type) === 1;
                const isConcretize = insConcreteOn && Number(ln?.type) === 2;
                const style = isReduction
                  ? {
                      backgroundColor: '#FDF5F5',
                      borderLeft: '4px solid #EF7C7C',
                      borderRadius: '4px',
                    }
                  : isConcretize
                    ? {
                        backgroundColor: '#F5FBF5',
                        borderLeft: '4px solid #97D099',
                        borderRadius: '4px',
                      }
                    : { borderLeft: '4px solid transparent', borderRadius: '4px' };
                return (
                  <p key={`ins-${idx}`} style={style}>
                    {text}
                  </p>
                );
              })}
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] ml-[40px] mr-[40px] block max-lg:hidden" />

            <div className="w-[620px] mt-[8px]">
              <div
                className="w-[620px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[12px]
              max-lg:w-[784px]"
              >
                <div className="text-[16px] font-semibold mb-[6px]">항목 총평</div>
                <div className="text-[18px] leading-[26px] whitespace-pre-line">
                  {currentCorrection?.correctionResult?.insights?.field_summary || ''}
                </div>
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle
                  isOn={insReduceOn}
                  onRToggle={(v) => {
                    setInsReduceOn(v);
                    if (v) setInsConcreteOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              {/* 축소 대상 라인 목록 (type === 1) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.insights?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 1)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`ins-reduce-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#EF7C7C] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 총평 내용은 상단 박스 안에 표시됨 */}

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle
                  isOn={insConcreteOn}
                  onCToggle={(v) => {
                    setInsConcreteOn(v);
                    if (v) setInsReduceOn(false);
                  }}
                />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              {/* 구체화 대상 라인 목록 (type === 2) */}
              <div className="mt-[20px]">
                {(
                  currentCorrection?.correctionResult?.insights?.lines ||
                  ([] as GeneratedLineItem[])
                )
                  .filter((ln: GeneratedLineItem) => Number(ln?.type) === 2)
                  .map((ln: GeneratedLineItem, idx: number) => {
                    const text = String(ln?.review_comment || '').trim();
                    if (!text) return null;
                    return (
                      <div key={`ins-concrete-${idx}`} className="flex items-start mb-[8px]">
                        <span className="w-[24px] text-[#97D099] font-semibold mr-[12px]">
                          {idx + 1}.
                        </span>
                        <p className="text-[18px] leading-[28px]">{text}</p>
                      </div>
                    );
                  })}
              </div>

              {/* 가이드 문구 제거 */}
            </div>
          </div>
        </div>{' '}
      </div>
      <CompanyInsightProcessModal
        isOpen={showInsightModal}
        onClose={() => setShowInsightModal(false)}
        companyName={companyNameForModal}
        keywords={(rag?.keywords || []).map((k: unknown) => String(k))}
        links={
          Array.isArray(rag?.links)
            ? rag!.links
                .map((raw: unknown) => {
                  try {
                    if (typeof raw === 'string') {
                      const url = new URL(raw);
                      const hostname = url.hostname.replace(/^www\./, '');
                      return { name: hostname, url: raw };
                    }
                    if (
                      raw &&
                      typeof raw === 'object' &&
                      'name' in (raw as { name?: unknown }) &&
                      'url' in (raw as { url?: unknown })
                    ) {
                      const obj = raw as { name?: unknown; url?: unknown };
                      return { name: String(obj.name), url: String(obj.url) };
                    }
                  } catch {
                    return typeof raw === 'string'
                      ? { name: '', url: raw }
                      : {
                          name: String((raw as Record<string, unknown>)?.name || ''),
                          url: String((raw as Record<string, unknown>)?.url || ''),
                        };
                  }
                  return null as unknown as { name: string; url: string };
                })
                .filter(
                  (v: { name: string; url: string } | null): v is { name: string; url: string } =>
                    !!v && !!v.url
                )
            : []
        }
      />
    </div>
  );
}

export default function TailoredPortfolio() {
  return (
    <Suspense fallback={null}>
      <TailoredPortfolioContent />
    </Suspense>
  );
}
