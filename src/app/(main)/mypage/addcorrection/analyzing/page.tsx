'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchRagData,
  fetchCorrectionDetail,
  fetchCompanyInsight,
  patchCompanyInsight,
} from '@/services/correction/correction';

export default function AiLoadingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [firstLinkName, setFirstLinkName] = useState<string>('');
  const [firstLinkUrl, setFirstLinkUrl] = useState<string>('');
  const [companyInsight, setCompanyInsight] = useState<string>('');
  const lastIdRef = useRef<number | null>(null);

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
    const idParam = searchParams.get('correctionId');
    const companyNameFromQuery = searchParams.get('companyName');
    if (companyNameFromQuery) setCompanyName(companyNameFromQuery);
    let correctionId = idParam ? Number(idParam) : NaN;

    // 쿼리에 id가 없을 때 세션스토리지 값으로 보조 조회
    if (!correctionId && typeof window !== 'undefined') {
      try {
        const last = window.sessionStorage.getItem('lastCorrectionId');
        if (last) {
          correctionId = Number(last);
          console.log('[Analyzing] using lastCorrectionId from sessionStorage:', correctionId);
        }
      } catch {}
    }
    if (!correctionId) return;

    // 다른 ID로 전환될 때 이전 상태 초기화
    if (lastIdRef.current !== correctionId) {
      console.log('[Analyzing] switching to new correctionId, clearing previous state:', {
        from: lastIdRef.current,
        to: correctionId,
      });
      setCompanyName(companyNameFromQuery || '');
      setKeywords([]);
      setFirstLinkName('');
      setFirstLinkUrl('');
      setCompanyInsight('');
      lastIdRef.current = correctionId;
    }

    // 디버그: 쿼리 파라미터 및 변환된 ID 로그
    console.log('[Analyzing] query params:', {
      idParam,
      correctionId,
      companyNameFromQuery,
    });

    // 1) 세션스토리지 prefetch가 있으면 즉시 반영
    try {
      const cached = sessionStorage.getItem(`analyzingPrefetch:${correctionId}`);
      if (cached) {
        const parsed = JSON.parse(cached) as {
          id: number;
          timestamp: number;
          detail: Awaited<ReturnType<typeof fetchCorrectionDetail>> | null;
          rag: Awaited<ReturnType<typeof fetchRagData>> | null;
          insight: Awaited<ReturnType<typeof fetchCompanyInsight>> | null;
        };
        if (parsed && parsed.id === correctionId) {
          if (parsed.detail?.title) setCompanyName(parsed.detail.title);
          if (parsed.rag?.keywords) setKeywords(parsed.rag.keywords);
          const first = parsed.rag?.links?.[0] as
            | string
            | { name: string; url: string }
            | undefined;
          if (first) {
            try {
              if (typeof first === 'string') {
                const url = new URL(first);
                const hostname = url.hostname.replace(/^www\./, '');
                setFirstLinkName(hostname);
                setFirstLinkUrl(first);
              } else if (first && typeof first === 'object' && 'name' in first && 'url' in first) {
                setFirstLinkName(first.name as string);
                setFirstLinkUrl(first.url as string);
              }
            } catch {
              setFirstLinkName('');
              setFirstLinkUrl(typeof first === 'string' ? first : (first?.url ?? ''));
            }
          }
          if (typeof parsed.insight?.companyInsight === 'string') {
            setCompanyInsight(parsed.insight.companyInsight);
          }
        }
      }
    } catch {}

    // 2) 백그라운드에서 한 번 더 신선한 데이터로 동기화
    fetchCorrectionDetail(correctionId)
      .then((res) => {
        console.log('[Analyzing] correction detail:', res);
        setCompanyName(res.title || '');
      })
      .catch((error) => {
        console.error('[Analyzing] failed to fetch correction detail:', error);
      });

    fetchRagData(correctionId)
      .then((res) => {
        console.log('[Analyzing] RAG data response:', res);
        const fetchedLinks = res?.links ?? [];
        setKeywords(res?.keywords ?? []);

        if (fetchedLinks.length > 0) {
          const raw = fetchedLinks[0] as string | { name: string; url: string };
          try {
            if (typeof raw === 'string') {
              const url = new URL(raw);
              const hostname = url.hostname.replace(/^www\./, '');
              setFirstLinkName(hostname);
              setFirstLinkUrl(raw);
              console.log('[Analyzing] first link (parsed):', { name: hostname, url: raw });
            } else if (raw && typeof raw === 'object' && 'name' in raw && 'url' in raw) {
              setFirstLinkName(raw.name as string);
              setFirstLinkUrl(raw.url as string);
              console.log('[Analyzing] first link (object):', raw);
            }
          } catch {
            setFirstLinkName('');
            setFirstLinkUrl(typeof raw === 'string' ? raw : (raw?.url ?? ''));
            console.warn('[Analyzing] failed to parse first link, using raw value:', raw);
          }
        }
      })
      .catch((error) => {
        console.error('[Analyzing] failed to fetch RAG data:', error);
      });

    fetchCompanyInsight(correctionId)
      .then((res) => {
        console.log(
          '[Analyzing] company insight fetched:',
          (res?.companyInsight || '').slice(0, 200),
          '...'
        );
        setCompanyInsight(res.companyInsight ?? '');
      })
      .catch((error) => {
        console.error('[Analyzing] failed to fetch company insight:', error);
      });

    // analyzing 페이지에서는 폴링하지 않음 (LoadingModal에서 준비 완료 후 진입)
    return undefined;
  }, [searchParams]);

  const handleNextClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const idParam = searchParams.get('correctionId');
    const correctionId = idParam ? Number(idParam) : NaN;
    if (correctionId && companyInsight) {
      try {
        console.log('[Analyzing] saving company insight before next step:', {
          correctionId,
          length: companyInsight.length,
        });
        await patchCompanyInsight(correctionId, { companyInsight });
      } catch {}
    }
    router.push('/mypage/addcorrection/projectSelect');
  };
  return (
    <div
      className="ml-[300px]
    max-lg:ml-[24px]"
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
              className="translate-y-[34px]
            max-lg:w-[60px] max-lg:h-[60px] max-lg:translate-y-[32px]"
            />
            <div
              className="relative ml-[28px]
            max-lg:ml-[8px]"
            >
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
                    <div className="border-l-[2px] border-[#E7E7E7] h-[135px] ml-[4px] mr-[21px]" />
                    <div className="border border-[#BBBBBB] rounded-[6px] bg-[#F8F8F8] mt-[6px] w-[94px] h-[36px] px-[12px] py-[6px] flex items-center">
                      <img src="/icons/SearchIcon.svg" alt="검색 아이콘" className="mr-[2px]" />
                      <p className="text-[16px]">{keywords[0] ?? '검색어'}</p>
                    </div>
                  </div>
                  <div className="flex text-[18px] items-center">
                    <img src="/icons/Cdot.svg" alt="포인터" className="mr-[16px]" />
                    <p className="mr-[4px]">검색 결과를 수집할게요.</p>
                  </div>
                  <div className="flex">
                    <div className="border-l-[2px] border-[#E7E7E7] h-[260px] ml-[4px] mr-[21px]" />
                    <div
                      className="border border-[#BBBBBB] rounded-[8px] bg-[#F8F8F8] w-[828px] h-[206px] mt-[6px] p-[12px] overflow-y-auto
                max-lg:w-[608px]"
                    >
                      <div className="flex items-center">
                        <img src="/icons/URLIcon.svg" alt="URL 아이콘" className="mr-[8px]" />
                        <p className="break-all">
                          {firstLinkUrl
                            ? `${firstLinkName} ${firstLinkUrl}`
                            : '사이트명 사이트 주소주소주소'}
                        </p>
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative ml-[1068px] mt-[20px]
          max-lg:ml-[660px]"
          >
            <img src="/icons/NextPageBubble.svg" alt="다음으로 말풍선" />
            <Link href="/mypage/addcorrection/projectSelect" onClick={handleNextClick}>
              <img
                src="/icons/NextPage.svg"
                alt="다음으로"
                className="absolute top-[36px] left-[52px] cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
