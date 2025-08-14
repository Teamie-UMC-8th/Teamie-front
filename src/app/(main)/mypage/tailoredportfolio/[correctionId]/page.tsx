'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  fetchCorrectionDetail,
  fetchGeneratedCorrection,
  fetchRagData,
} from '@/services/correction/correction';
import DeleteButton from '@/components/DeleteButton';
import ReductionToggle from '@/features/correction/components/ReductionToggle';
import TailoredDropdown from '@/features/correction/components/TailoredDropdown';
import Link from 'next/link';
import ReductionMark from '@/features/correction/components/ReductionMark';
import ConcretizationMark from '@/features/correction/components/ConcretizationMark';
import ConcretizationToggle from '@/features/correction/components/ConcretizationToggle';
import Image from 'next/image';
import CompanyInsightProcessModal from '@/features/correction/components/CompanyInsightProcessModal';

export default function TailoredPortfolio() {
  const params = useParams();
  const correctionId = Number(params.correctionId);
  const searchParams = useSearchParams();
  const [toggleROn, setRToggleOn] = useState(false);
  const [toggleCOn, setCToggleOn] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['correction-detail', correctionId],
    queryFn: () => fetchCorrectionDetail(correctionId),
    enabled: !!correctionId,
  });

  const { data: generated } = useQuery({
    queryKey: ['generated-correction', correctionId],
    queryFn: () => fetchGeneratedCorrection(correctionId),
    enabled: !!correctionId,
    staleTime: 60_000,
  });

  const { data: rag } = useQuery({
    queryKey: ['generated-rag', correctionId],
    queryFn: () => fetchRagData(correctionId),
    enabled: !!correctionId,
    staleTime: 60_000,
  });

  if (isLoading) return <div>AI 첨삭 정보를 불러오는 중...</div>;
  if (error) return <div>AI 첨삭 정보를 불러오는데 실패했습니다.</div>;
  if (!data) return <div>AI 첨삭 정보를 찾을 수 없습니다.</div>;

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
            className="text-[24px] font-semibold mt-[28px] ml-[20px]
          max-lg:ml-[8px]"
          >
            {data.title || '새로운 첨삭'}
          </h1>
        </div>
        <DeleteButton
          onDelete={() => {
            // 삭제 로직 작성
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
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
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
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px]">
              기업명
            </div>
            <p className="ml-[28px] text-[20px] mr-[342px]">{data.submissionTarget}</p>

            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ">
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
            className=" mt-[16px] border-[2px] border-[#BBBBBB] w-[1520px] h-[162px] rounded-[8px] px-[20px] py-[16px] text-[18px]
          max-lg:w-[928px] max-lg:h-[176px]"
            defaultValue={
              generated?.firstCorrection?.correctionResult?.insights?.field_summary || ''
            }
          />
        </div>

        <div
          className="ml-[80px] mt-[80px]
        max-lg:ml-[24px] max-lg:mt-[40px]"
        >
          <div className="text-[22px] font-semibold">JD (Job Description)</div>
          <textarea
            className=" mt-[16px] border-[2px] border-[#BBBBBB] w-[1520px] h-[162px] rounded-[8px] px-[20px] py-[16px] text-[18px]
          max-lg:w-[928px] max-lg:h-[176px]"
            defaultValue={data?.content || ''}
          />
        </div>
      </div>

      <div
        className="flex mt-[80px] ml-[96px]
      max-lg:ml-[40px]"
      >
        <div className="bg-[#E9F8F8] w-[160px] h-[58px] rounded-tl-[8px] rounded-tr-[8px] grid place-items-end">
          <p className="font-bold mr-[40px] text-[18px]">프로젝트 1</p>
          <div className="w-[160px] h-[4px] bg-[#81D7D4] " />
        </div>
        <div className="bg-[#F8F8F8] w-[160px] h-[58px] rounded-tl-[8px] rounded-tr-[8px] py-[16px]">
          <p className="font-bold mr-[40px] text-[18px] ml-[40px]">프로젝트 2</p>
        </div>
        <div className="bg-[#F8F8F8] w-[160px] h-[58px] rounded-tl-[8px] rounded-tr-[8px] py-[16px]">
          <p className="font-bold mr-[40px] text-[18px] ml-[40px]">프로젝트 3</p>
        </div>
      </div>

      {/* 프로젝트 별 첨삭 내용*/}
      <div
        className="w-[1520px] h-[2757px] bg-[#F8F8F8] ml-[80px] rounded-[16px] relative z-10 p-[60px]
        max-lg:w-[928px] max-lg:h-[4325px] max-lg:p-[36px] max-lg:ml-[24px]"
        style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
      >
        <div className="flex flex-row items-center w-[1500px]">
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] font-semibold text-[18px]">
            진행 기간
          </div>
          <p className="text-black text-[20px] grid place-items-center ml-[28px]">
            {generated?.firstCorrection?.projectName || ''}
          </p>
          <div
            className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[154px] mr-[8px] font-semibold text-[18px]
          max-lg:ml-[229px]"
          >
            분류
          </div>
          <TailoredDropdown />
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[154px] font-semibold text-[18px]">
            기여도
          </div>
          <Image
            src="/icons/CorrectionPercentbar.svg"
            alt="기여도 퍼센트바"
            className="ml-[28px]"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 'auto', height: 'auto' }}
          />
          <p className="text-[20px] ml-[20px]">80%</p>
        </div>
        <div
          className="mt-[80px]
        max-lg:mt-[48px]"
        >
          <div className="text-[22px] font-semibold">AI 첨삭 내용</div>
          <div className="mt-[10px] border-[#E7E7E7] border-[1px] " />
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">상세정보</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              {(generated?.firstCorrection?.correctionResult?.detailInfo?.lines || []).map((ln) => (
                <p key={ln.line_number}>- {ln.original_content}</p>
              ))}

              <p className="mt-[48px]" />
              {toggleROn && <ReductionMark />}
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">담당 업무</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              <p>[연간 활동 기획 및 운영 총괄]</p>
              <p>- 동아리 연간 활동 계획 및 예산안 수립</p>
              <p>- 월 1회 정기모임 및 분기 1회 특별 행사 기획∙운영</p>
              <p>- 전산장부 시스템 도입 및 동아리 전체 예산 집행, 회계 처리 총괄</p>
              <p>- 타 부서(홍보국, 대외협력국) 협업 및 연간/상반기 운영 현황 보고</p>

              <p className="mt-[48px]" />
              <p>[참여 경험 고도화 및 문제 해결]</p>
              <p>- 참여자 피드백 기반 프로그램 개선 (활동지 난이도 분리, 익명 피드백 도입 등)</p>
              <p>- 사전 설문 기반 참여자 성향 분석 및 맞춤형 조 편성 시스템 설계</p>
              <p className="mt-[48px]" />
              <p>
                어려움과 극복 과정: 회원 간 친분 형성 후 공식 활동 참여율이 저하되는 문제가
                발생했습니다. 이를 해결하기 위해 대외협력국과 협력하여 기업 연계 프로그램을 유치,
                동아리에서만 가능한 &apos;이력서 작성&apos; 프로그램을 기획했습니다. 실제 기업의
                피드백 기회를 제공한 결과, 해당 모임 참여율이 이전 대비 170% 증가했고 72건의 긍정
                피드백을 확보했습니다.
                {/* TODO: 글 위에 마크 올리기 */}
                {toggleCOn && <ConcretizationMark />}
              </p>
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">주요 성과</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              <p>[연간 활동 기획 및 운영 총괄]</p>
              <p>- 동아리 연간 활동 계획 및 예산안 수립</p>
              <p>- 월 1회 정기모임 및 분기 1회 특별 행사 기획∙운영</p>
              <p>- 전산장부 시스템 도입 및 동아리 전체 예산 집행, 회계 처리 총괄</p>
              <p>- 타 부서(홍보국, 대외협력국) 협업 및 연간/상반기 운영 현황 보고</p>

              <p className="mt-[48px]" />
              <p>[참여 경험 고도화 및 문제 해결]</p>
              <p>- 참여자 피드백 기반 프로그램 개선 (활동지 난이도 분리, 익명 피드백 도입 등)</p>
              <p>- 사전 설문 기반 참여자 성향 분석 및 맞춤형 조 편성 시스템 설계</p>
              <p className="mt-[48px]" />
              <p>
                어려움과 극복 과정: 회원 간 친분 형성 후 공식 활동 참여율이 저하되는 문제가
                발생했습니다. 이를 해결하기 위해 대외협력국과 협력하여 기업 연계 프로그램을 유치,
                동아리에서만 가능한 &apos;이력서 작성&apos; 프로그램을 기획했습니다. 실제 기업의
                피드백 기회를 제공한 결과, 해당 모임 참여율이 이전 대비 170% 증가했고 72건의 긍정
                피드백을 확보했습니다.
                {/* TODO: 글 위에 마크 올리기 */}
              </p>
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">배운 점</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              <p>[연간 활동 기획 및 운영 총괄]</p>
              <p>- 동아리 연간 활동 계획 및 예산안 수립</p>
              <p>- 월 1회 정기모임 및 분기 1회 특별 행사 기획∙운영</p>
              <p>- 전산장부 시스템 도입 및 동아리 전체 예산 집행, 회계 처리 총괄</p>
              <p>- 타 부서(홍보국, 대외협력국) 협업 및 연간/상반기 운영 현황 보고</p>

              <p className="mt-[48px]" />
              <p>[참여 경험 고도화 및 문제 해결]</p>
              <p>- 참여자 피드백 기반 프로그램 개선 (활동지 난이도 분리, 익명 피드백 도입 등)</p>
              <p>- 사전 설문 기반 참여자 성향 분석 및 맞춤형 조 편성 시스템 설계</p>
              <p className="mt-[48px]" />
              <p>
                어려움과 극복 과정: 회원 간 친분 형성 후 공식 활동 참여율이 저하되는 문제가
                발생했습니다. 이를 해결하기 위해 대외협력국과 협력하여 기업 연계 프로그램을 유치,
                동아리에서만 가능한 &apos;이력서 작성&apos; 프로그램을 기획했습니다. 실제 기업의
                피드백 기회를 제공한 결과, 해당 모임 참여율이 이전 대비 170% 증가했고 72건의 긍정
                피드백을 확보했습니다.
                {/* TODO: 글 위에 마크 올리기 */}
              </p>
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
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
