'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchRagData,
  fetchCorrectionDetail,
  fetchCompanyInsight,
  patchCompanyInsight,
} from '@/services/correction/correction';

function AiLoadingPageContent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const idParamStr = searchParams.get('correctionId') ?? '';
  const companyNameQuery = searchParams.get('submissionTarget') ?? '';
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [companyInsight, setCompanyInsight] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const lastIdRef = useRef<number | null>(null);
  const loadedFromPrefetchRef = useRef<boolean>(false);
  const lastSavedRef = useRef<string>('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctionIdNum = idParamStr ? Number(idParamStr) : NaN;

  // 언마운트 시 토스트 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // 상태 변화 콘솔 반영
  useEffect(() => {
    console.log('[Analyzing][state] companyName:', companyName || '(empty)');
  }, [companyName]);

  useEffect(() => {
    if (!keywords || keywords.length === 0) {
      console.log('[Analyzing][state] keywords: (empty)');
    } else {
      console.log('[Analyzing][state] keywords:', keywords);
    }
  }, [keywords]);

  useEffect(() => {
    if (!links || links.length === 0) {
      console.log('[Analyzing][state] links: (empty)');
    } else {
      console.log('[Analyzing][state] links count:', links.length, links);
    }
  }, [links]);

  useEffect(() => {
    const preview = (companyInsight || '').slice(0, 160);
    console.log(
      '[Analyzing][state] companyInsight length:',
      (companyInsight || '').length,
      'preview:',
      preview,
      '...'
    );
  }, [companyInsight]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // 페이지 로딩 후 1초 뒤에 스크롤 애니메이션 시작
    const timer = setTimeout(() => {
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      // 3초 동안 부드럽게 스크롤
      const duration = 500;
      const startTime = Date.now();

      const animateScroll = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 애니메이션
        const easeProgress =
          progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        scrollContainer.scrollTop = maxScroll * easeProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 실제 데이터 로드 (기업명, 검색어, 링크, 기업 분석 정보)
  useEffect(() => {
    console.log('[Analyzing] effect start');
    const companyNameFromQuery = companyNameQuery;
    if (companyNameFromQuery) {
      setCompanyName(companyNameFromQuery);
    }
    const correctionId = idParamStr ? Number(idParamStr) : NaN;
    if (!correctionId) return;

    // 이 페이지를 마지막 방문 위치로 기록 (복귀 라우팅에 사용)
    try {
      // 인트로가 마지막 위치로 저장되어 있으면 우선권을 유지하고, 아니면 analyzing으로 기록
      if (!sessionStorage.getItem('correctionIntro:last')) {
        sessionStorage.setItem(`correctionReturn:${correctionId}`, 'analyzing');
      }
    } catch {}

    // 다른 ID로 전환될 때 이전 상태 초기화
    if (lastIdRef.current !== correctionId) {
      console.log('[Analyzing] switching to new correctionId, clearing previous state:', {
        from: lastIdRef.current,
        to: correctionId,
      });
      setCompanyName(companyNameFromQuery || '');
      setKeywords([]);
      setLinks([]);
      setCompanyInsight('');
      lastIdRef.current = correctionId;
    }

    // 0) 기업명 캐시: analyzing에서 본 기업명을 세션에 저장해 두어 다른 페이지에서 사용할 수 있게 함
    try {
      const correctionId = idParamStr ? Number(idParamStr) : NaN;
      if (companyNameFromQuery && Number.isFinite(correctionId)) {
        sessionStorage.setItem(`companyName:${correctionId}`, companyNameFromQuery);
      }
      // 보조 키: 생성 직전 저장했던 값이 있으면 최신값 유지
      const backup = sessionStorage.getItem('lastCorrectionCompanyName');
      if (!companyNameFromQuery && backup) setCompanyName(backup || '');
    } catch {}

    // 1) 세션스토리지 prefetch가 있으면 즉시 반영
    try {
      const cached: string | null = sessionStorage.getItem(`analyzingPrefetch:${correctionId}`);
      const cachedStr: string = cached ?? '';
      if (cachedStr.length > 0) {
        const parsed = JSON.parse(cachedStr) as {
          id: number;
          timestamp: number;
          detail: Awaited<ReturnType<typeof fetchCorrectionDetail>> | null;
          rag: Awaited<ReturnType<typeof fetchRagData>> | null;
          insight: Awaited<ReturnType<typeof fetchCompanyInsight>> | null;
        };
        if (parsed && parsed.id === correctionId) {
          const hasSubmissionTarget = !!(
            parsed.detail && (parsed.detail as { submissionTarget?: string }).submissionTarget
          );
          if (hasSubmissionTarget)
            setCompanyName((parsed.detail as { submissionTarget?: string }).submissionTarget || '');
          const hasRagKeywords = !!(parsed.rag && (parsed.rag as { keywords?: string[] }).keywords);
          if (hasRagKeywords) setKeywords((parsed.rag as { keywords?: string[] }).keywords || []);
          if (parsed.rag && Array.isArray((parsed.rag as { links?: unknown[] }).links)) {
            const normalized = ((parsed.rag as { links?: unknown[] }).links || [])
              .map((raw) => {
                try {
                  if (typeof raw === 'string') {
                    const url = new URL(raw);
                    const hostname = url.hostname.replace(/^www\./, '');
                    return { title: hostname, url: raw };
                  }
                  if (raw && typeof raw === 'object') {
                    if ('title' in raw && 'url' in raw) {
                      return {
                        title: String((raw as Record<string, unknown>)?.title),
                        url: String((raw as Record<string, unknown>)?.url),
                      };
                    }
                    if ('name' in raw && 'url' in raw) {
                      return {
                        title: String((raw as Record<string, unknown>)?.name),
                        url: String((raw as Record<string, unknown>)?.url),
                      };
                    }
                  }
                } catch {
                  return typeof raw === 'string'
                    ? { title: '', url: raw }
                    : {
                        title: String(
                          (raw as Record<string, unknown>)?.title ||
                            (raw as Record<string, unknown>)?.name ||
                            ''
                        ),
                        url: String((raw as Record<string, unknown>)?.url || ''),
                      };
                }
                return null;
              })
              .filter((v): v is { title: string; url: string } => !!v && !!v.url);
            setLinks(normalized);
            console.log('[Analyzing][prefetch] links normalized count:', normalized.length);
          }
          if (
            parsed.insight &&
            typeof (parsed.insight as { companyInsight?: string }).companyInsight === 'string'
          ) {
            setCompanyInsight((parsed.insight as { companyInsight?: string }).companyInsight || '');
          }

          // prefetch에 필요한 모든 데이터가 이미 준비되었으면 네트워크 재호출 생략
          const hasReadyPrefetch =
            !!(parsed.rag && Array.isArray((parsed.rag as { keywords?: unknown[] }).keywords)) &&
            ((parsed.rag as { keywords?: unknown[] }).keywords || []).length > 0 &&
            !!(parsed.rag && Array.isArray((parsed.rag as { links?: unknown[] }).links)) &&
            ((parsed.rag as { links?: unknown[] }).links || []).length > 0 &&
            !!(
              parsed.insight &&
              typeof (parsed.insight as { companyInsight?: string }).companyInsight === 'string'
            ) &&
            ((parsed.insight as { companyInsight?: string }).companyInsight || '').trim().length >
              0;
          if (hasReadyPrefetch) {
            // 네트워크 재호출은 줄이되 최신 회사 인사이트는 항상 새로 조회해야 하므로 조기 종료하지 않음
            loadedFromPrefetchRef.current = true;
            console.log('[Analyzing][prefetch] applied from session cache');
          }
        }
      }
    } catch {}

    // 디버그: 쿼리 파라미터 및 변환된 ID 로그
    console.log('[Analyzing] query params:', {
      idParam: idParamStr,
      correctionId,
      companyNameFromQuery,
    });

    if (!loadedFromPrefetchRef.current) {
      fetchCorrectionDetail(correctionId)
        .then((res) => {
          console.log('[Analyzing] correction detail:', res);
          setCompanyName(res.submissionTarget || '');
        })
        .catch((error) => {
          console.error('[Analyzing] failed to fetch correction detail:', error);
        });

      fetchRagData(correctionId)
        .then((res) => {
          console.log('[Analyzing] RAG data response:', res);
          const fetchedLinks = res?.links ?? [];
          setKeywords(res?.keywords ?? []);
          if (Array.isArray(fetchedLinks)) {
            const normalized = fetchedLinks
              .map((raw) => {
                try {
                  if (typeof raw === 'string') {
                    const url = new URL(raw);
                    const hostname = url.hostname.replace(/^www\./, '');
                    return { title: hostname, url: raw };
                  }
                  if (
                    raw &&
                    typeof raw === 'object' &&
                    (('title' in raw && 'url' in raw) || ('name' in raw && 'url' in raw))
                  ) {
                    const obj = raw as { title?: unknown; name?: unknown; url?: unknown };
                    return {
                      title: String(
                        (obj.title as string | undefined) || (obj.name as string | undefined) || ''
                      ),
                      url: String(obj.url as string | undefined),
                    };
                  }
                } catch {
                  return typeof raw === 'string'
                    ? { title: '', url: raw }
                    : {
                        title: String(
                          (raw as Record<string, unknown>)?.title ||
                            (raw as Record<string, unknown>)?.name ||
                            ''
                        ),
                        url: String((raw as Record<string, unknown>)?.url || ''),
                      };
                }
                return null;
              })
              .filter((v): v is { title: string; url: string } => !!v && !!v.url);
            setLinks(normalized);
            console.log('[Analyzing] RAG links normalized count:', normalized.length);
          }
        })
        .catch((error) => {
          console.error('[Analyzing] failed to fetch RAG data:', error);
        });
    }

    // 회사 인사이트는 항상 최신값을 가져와서 표시
    fetchCompanyInsight(correctionId)
      .then((res) => {
        console.log(
          '[Analyzing] company insight fetched:',
          (res?.companyInsight || '').slice(0, 200),
          '...'
        );
        setCompanyInsight(res.companyInsight ?? '');
        // 최초 로드 시 마지막 저장값 동기화
        lastSavedRef.current = res.companyInsight ?? '';
      })
      .catch((error) => {
        console.error('[Analyzing] failed to fetch company insight:', error);
      });

    // analyzing 페이지에서는 폴링하지 않음 (LoadingModal에서 준비 완료 후 진입)
    // 언마운트될 때도 마지막 위치를 analyzing로 유지 (다른 페이지에서 덮어씌우지 않는 한)
    return () => {
      try {
        if (!sessionStorage.getItem('correctionIntro:last')) {
          sessionStorage.setItem(`correctionReturn:${correctionId}`, 'analyzing');
        }
      } catch {}
    };
  }, [idParamStr, companyNameQuery]);

  const handleNextClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const idParam = searchParams.get('correctionId');
    const correctionId = idParam ? Number(idParam) : NaN;
    // 다음으로 이동 시에는 서버 저장하지 않음 (임시저장 버튼에서만 저장)
    const nextUrl =
      `/myPage/addCorrection/projectSelect?correctionId=${correctionId}` +
      (companyName ? `&submissionTarget=${encodeURIComponent(companyName)}` : '');
    console.log('[Analyzing] navigating to projectSelect:', { nextUrl });
    router.push(nextUrl);
  };

  // 임시 저장 (페이지 이동 없음)
  const handleTempSaveAndExit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const idParam = searchParams.get('correctionId');
    const correctionId = idParam ? Number(idParam) : NaN;
    try {
      if (correctionId) {
        console.log('[Analyzing] temporary save triggered:', {
          correctionId,
          companyInsightLength: companyInsight.length,
        });
        // 임시저장 시에만 기업 분석 정보 수정 API 호출
        await patchCompanyInsight(correctionId, { companyInsight });
        lastSavedRef.current = companyInsight;
      }
    } catch (err) {
      console.error('[Analyzing] temporary save failed:', err);
    }
    // 임시 저장 시 페이지 이동하지 않음
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 포커스 아웃 시 즉시 저장 보장
  const handleInsightBlur = async () => {
    if (!correctionIdNum) return;
    const value = companyInsight;
    try {
      // 포커스 아웃 시 서버 저장하지 않음 (임시저장 버튼에서만 저장)
      if (value === lastSavedRef.current) return;
      lastSavedRef.current = value;
      console.log('[Analyzing] insight blur updated lastSavedRef:', {
        length: value.length,
      });
    } catch (err) {
      console.error('[Analyzing] blur save failed:', err);
    }
  };
  return (
    <div
      className="ml-[140px]
    max-lg:ml-[0px]"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-[1323px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[12px] font-semibold text-[20px]
        max-lg:w-[908px]"
        >
          AI 지원 맞춤 포트폴리오 첨삭
        </div>
        <div
          className="w-[1359px] h-[800px] bg-[#F8F8F8] rounded-[16px] relative
        max-lg:w-[928px] max-lg:h-[878px]"
          style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
        >
          <div
            className="flex items-start ml-[60px] mt-[32px]
          max-lg:ml-[32px] max-lg:mt-[8px]"
          >
            <img
              src="/icons/AiCharacter.svg"
              alt="AI 로고"
              className="translate-y-[18px]
            max-lg:w-[70px] max-lg:h-[70px] max-lg:translate-y-[32px]"
            />
            <div className="relative">
              <img
                src="/icons/LoadingBubble.svg"
                alt="로딩중 말풍선"
                className="block max-lg:hidden"
              />
              <img
                src="/icons/ResponsiveAnalyzingBubble.svg"
                alt="반응형 말풍선"
                className="hidden max-lg:block"
              />

              <div
                ref={scrollContainerRef}
                className="absolute top-[40px] left-[0px] px-[94px] w-[1100px] h-[480px] overflow-y-auto
              max-lg:px-[93px] max-lg:pt-[48px]"
              >
                <div
                  className="mt-[-40px] pt-[50px]
                max-lg:pt-[0px]"
                >
                  <div className="flex text-[18px] relative">
                    <div className="flex-col">
                      <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                      <div className="border-l-[2px] border-[#E7E7E7] h-[32px] ml-[4px] mt-[8px]" />
                      {/* TODO: 기업명 데이터 받아오기 */}
                    </div>
                    <div
                      className="mr-[4px] translate-y-[-8px]
                      max-lg:w-[608px] "
                    >
                      {companyName
                        ? `${companyName}의 인재상과 사업 방향성, 강점과 약점을 분석할게요.`
                        : '기업명의 인재상과 사업 방향성, 강점과 약점을 분석할게요.'}
                    </div>
                  </div>

                  <div className="flex text-[18px] items-center">
                    <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                    <p className="mr-[4px]">검색을 진행할게요.</p>
                  </div>
                  <div className="flex">
                    <div className="border-l-[2px] border-[#E7E7E7] ml-[4px] mr-[21px]" />
                    <div className="mt-[6px] flex flex-wrap gap-[8px]">
                      {(keywords && keywords.length > 0 ? keywords : ['검색어']).map(
                        (kw, idx, arr) => (
                          <div
                            key={`${String(kw)}-${idx}`}
                            className={`border border-[#BBBBBB] rounded-[6px] bg-[#F8F8F8] h-[36px] px-[12px] py-[6px] flex items-center ${
                              idx === arr.length - 1 ? 'mb-[40px]' : ''
                            }`}
                          >
                            <img
                              src="/icons/SearchIcon.svg"
                              alt="검색 아이콘"
                              className="mr-[2px]"
                            />
                            <p className="text-[16px]">{String(kw)}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex text-[18px] items-center">
                    <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                    <p className="mr-[4px]">검색 결과를 수집할게요.</p>
                  </div>
                  <div className="flex">
                    <div className="border-l-[2px] border-[#E7E7E7] h-[260px] ml-[4px] mr-[21px]" />
                    <div
                      className="border border-[#BBBBBB] rounded-[8px] bg-[#F8F8F8] w-[940px] h-[206px] mt-[6px] p-[12px] overflow-y-auto flex-none
                max-lg:w-[608px]"
                    >
                      <div className="flex flex-col gap-[12px]">
                        {(links.length > 0 ? links : [{ title: '사이트명', url: '주소' }]).map(
                          (item, idx) => (
                            <a
                              key={`${item.url}-${idx}`}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <img src="/icons/URLIcon.svg" alt="URL 아이콘" className="mr-[8px]" />
                              <p className="break-all">{`${item.title ? item.title + ' ' : ''}${item.url}`}</p>
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" text-[18px]">
                    <div className="flex items-center">
                      <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                      <p>기업 분석 정보 생성을 완료했어요.</p>
                    </div>
                    <p className="ml-[26px]">
                      아래 내용에서 추가 또는 수정하고 싶으신 부분이 있다면, 작성해주세요.
                      <br />
                      작성해주신 최종 기업 분석 정보를 바탕으로 첨삭을 진행할게요.
                    </p>
                    <textarea
                      className="border border-[#BBBBBB] w-[940px] h-[362px] rounded-[8px] bg-white mt-[16px] ml-[26px] pl-[20px] py-[16px] pr-[10px]
                      max-lg:w-[608px] max-lg:h-[360px]"
                      value={companyInsight}
                      onChange={(e) => setCompanyInsight(e.target.value)}
                      onBlur={handleInsightBlur}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex ml-[680px] gap-[20px] mt-[20px] items-center
          max-lg:ml-[240px]"
          >
            <div
              className={`${''} border-[2px] border-[#BBBBBB] bg-[#F8F8F8] px-[20px] py-[6px] w-[236px] h-[42px] text-[18px] rounded-[6px] text-[#505050] items-center ${
                showToast ? 'opacity-100' : 'opacity-0'
              } transition-opacity pointer-events-none`}
            >
              임시저장이 완료되었습니다
            </div>
            <div className="relative">
              <img src="/icons/NextPageBubble-ProjectSelect.svg" alt="다음으로 말풍선" />
              <div className="absolute left-[52px] top-[36px] flex items-center gap-[24px]">
                <button
                  onClick={handleTempSaveAndExit}
                  className="px-[32px] py-[6px] text-black text-[18px] font-medium border border-[#898989] rounded-[6px] bg-[#FFFFFF] cursor-pointer"
                >
                  임시저장
                </button>
                <Link href="/myPage/addCorrection/projectSelect" onClick={handleNextClick}>
                  <img src="/icons/NextPage.svg" alt="다음으로" className="cursor-pointer" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiLoadingPage() {
  return (
    <Suspense fallback={null}>
      <AiLoadingPageContent />
    </Suspense>
  );
}
